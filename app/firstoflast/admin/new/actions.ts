"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const NEW_VALUE = "__new__";

type CollectibleStatus = "OWNED" | "PLANNED" | "WISHLIST";
type ReferenceType = "WIKIPEDIA" | "OFFICIAL" | "FANDOM" | "OTHER";
type Condition =
  | "MINT"
  | "NEAR_MINT"
  | "EXCELLENT"
  | "GOOD"
  | "FAIR"
  | "POOR"
  | "DAMAGED";
type PurchaseStatus = "OWNED" | "SOLD" | "GIFTED";

type EditableValue = string | number | boolean | null;
type UpdateValues = Record<string, EditableValue>;

const BLOCKED_UPDATE_FIELDS = new Set([
  "id",
  "created_at",
  "updated_at",
  "createdAt",
  "updatedAt",
  "user_id",
  "userId",
  "auth_user_id",
  "authUserId",
]);

function nowIso() {
  return new Date().toISOString();
}

function withTimestamps(values: Record<string, unknown>) {
  const now = nowIso();

  return {
    ...values,
    created_at: now,
    updated_at: now,
  };
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function numberOrNull(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value || value === NEW_VALUE) return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function decimalOrNull(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function dateOrNull(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/firstoflast/admin");

  const { data: admin } = await supabase
    .from("admin")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) redirect("/firstoflast");

  return { supabase, user };
}

async function getNameById(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  id: number | null
) {
  if (!id) return "";

  const { data, error } = await supabase
    .from(table)
    .select("name")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data?.name || "";
}

async function uploadImages({
  supabase,
  userId,
  collectibleId,
  editionId,
  files,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  collectibleId: number;
  editionId?: number | null;
  files: File[];
}) {
  const uploadedUrls: string[] = [];

  for (const image of files) {
    const extension = image.name.split(".").pop() || "jpg";
    const filePath = `${userId}/${collectibleId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("collectibles")
      .upload(filePath, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from("collectibles")
      .getPublicUrl(filePath);

    uploadedUrls.push(data.publicUrl);
  }

  if (uploadedUrls.length === 0) return;

  const now = nowIso();

  const { error: coverError } = await supabase
    .from("collectible")
    .update({
      image_url: uploadedUrls[0],
      updated_at: now,
    })
    .eq("id", collectibleId);

  if (coverError) throw new Error(coverError.message);

  const { error: mediaError } = await supabase.from("media").insert(
    uploadedUrls.map((url) => ({
      collectible_id: collectibleId,
      edition_id: editionId || null,
      url,
      created_at: now,
    }))
  );

  if (mediaError) throw new Error(mediaError.message);
}

async function createCharacterReference(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  characterId: number
) {
  const url = text(formData, "new_character_reference_url");
  if (!url) return;

  const type = (text(formData, "new_character_reference_type") ||
    "OTHER") as ReferenceType;

  if (!["WIKIPEDIA", "OFFICIAL", "FANDOM", "OTHER"].includes(type)) {
    throw new Error("Invalid character reference type.");
  }

  const label = text(formData, "new_character_reference_label");

  const { error } = await supabase.from("character_reference").insert({
    character_id: characterId,
    type,
    url,
    label: label || null,
    created_at: nowIso(),
  });

  if (error) throw new Error(error.message);
}

export async function createCollectible(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const customTitle = text(formData, "custom_title");
  const description = text(formData, "description");
  const status = (text(formData, "status") || "OWNED") as CollectibleStatus;

  if (!["OWNED", "PLANNED", "WISHLIST"].includes(status)) {
    throw new Error("Invalid collection status.");
  }

  let categoryId = numberOrNull(formData, "category_id");
  let subtypeId = numberOrNull(formData, "subtype_id");
  let brandId = numberOrNull(formData, "brand_id");
  let franchiseId = numberOrNull(formData, "franchise_id");
  let characterId = numberOrNull(formData, "character_id");
  let seriesId = numberOrNull(formData, "series_id");

  if (text(formData, "category_id") === NEW_VALUE) {
    const name = text(formData, "new_category_name");
    const icon = text(formData, "new_category_icon");

    if (!name) throw new Error("New category name is required.");

    const { data, error } = await supabase
      .from("category")
      .insert(withTimestamps({ name, icon: icon || null }))
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    categoryId = data.id;
  }

  if (!categoryId) throw new Error("Category is required.");

  if (text(formData, "subtype_id") === NEW_VALUE) {
    const name = text(formData, "new_subtype_name");

    if (!name) throw new Error("New subtype name is required.");

    const { data, error } = await supabase
      .from("subtype")
      .insert(withTimestamps({ name, category_id: categoryId }))
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    subtypeId = data.id;
  }

  if (!subtypeId) throw new Error("Subtype is required.");

  if (text(formData, "brand_id") === NEW_VALUE) {
    const name = text(formData, "new_brand_name");

    if (!name) throw new Error("New brand name is required.");

    const { data, error } = await supabase
      .from("brand")
      .insert(withTimestamps({ name }))
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    brandId = data.id;
  }

  if (text(formData, "franchise_id") === NEW_VALUE) {
    const name = text(formData, "new_franchise_name");

    if (!name) throw new Error("New franchise name is required.");

    const { data, error } = await supabase
      .from("franchise")
      .insert(withTimestamps({ name }))
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    franchiseId = data.id;
  }

  if (text(formData, "character_id") === NEW_VALUE) {
    const name = text(formData, "new_character_name");
    const notes = text(formData, "new_character_notes");

    if (!name) throw new Error("New character name is required.");

    const { data, error } = await supabase
      .from("character")
      .insert(
        withTimestamps({
          name,
          franchise_id: franchiseId,
          notes: notes || null,
        })
      )
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    characterId = data.id;

    if (characterId !== null) {
      await createCharacterReference(supabase, formData, characterId);
    }
  }

  if (text(formData, "series_id") === NEW_VALUE) {
    if (!franchiseId) throw new Error("Franchise is required for a new series.");

    const name = text(formData, "new_series_name");
    const format = text(formData, "new_series_format") || "OTHER";
    const totalUnits = numberOrNull(formData, "new_series_total_units");
    const notes = text(formData, "new_series_notes");

    if (!name) throw new Error("New series name is required.");

    const { data, error } = await supabase
      .from("series")
      .insert(
        withTimestamps({
          name,
          format,
          total_units: totalUnits,
          notes: notes || null,
          franchise_id: franchiseId,
        })
      )
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    seriesId = data.id;
  }

  const brandName = await getNameById(supabase, "brand", brandId);
  const franchiseName = await getNameById(supabase, "franchise", franchiseId);
  const characterName = await getNameById(supabase, "character", characterId);
  const subtypeName = await getNameById(supabase, "subtype", subtypeId);

  const generatedTitle = [franchiseName, characterName, brandName, subtypeName]
    .filter(Boolean)
    .join(" ");

  const title = customTitle || generatedTitle;

  if (!title) {
    throw new Error("Title is required when an auto title cannot be generated.");
  }

  const now = nowIso();

  const { data: collectible, error: collectibleError } = await supabase
    .from("collectible")
    .insert({
      title,
      description: description || null,
      image_url: null,
      status,
      brand_id: brandId,
      category_id: categoryId,
      subtype_id: subtypeId,
      franchise_id: franchiseId,
      series_id: seriesId,
      character_id: characterId,
      series_number: numberOrNull(formData, "series_number"),
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (collectibleError) throw new Error(collectibleError.message);

  let editionId: number | null = null;

  if (bool(formData, "create_edition")) {
    const { data: edition, error: editionError } = await supabase
      .from("edition")
      .insert({
        collectible_id: collectible.id,
        series_id: seriesId,
        edition_number: numberOrNull(formData, "edition_number"),
        edition_name: text(formData, "edition_name") || null,
        exclusive_label: text(formData, "exclusive_label") || null,
        release_date: dateOrNull(formData, "release_date"),
        edition_size: numberOrNull(formData, "edition_size"),
        sku: text(formData, "sku") || null,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (editionError) throw new Error(editionError.message);
    editionId = edition.id;
  }

  if (bool(formData, "create_purchase")) {
    let lotId = numberOrNull(formData, "lot_id");

    if (text(formData, "lot_id") === NEW_VALUE) {
      const lotName = text(formData, "new_lot_name");

      const { data: lot, error: lotError } = await supabase
        .from("lot")
        .insert(withTimestamps({ name: lotName || null }))
        .select("id")
        .single();

      if (lotError) throw new Error(lotError.message);
      lotId = lot.id;
    }

    const condition = (text(formData, "condition") || "MINT") as Condition;
    const purchaseStatus = (text(formData, "purchase_status") ||
      "OWNED") as PurchaseStatus;

    const purchasedAt = dateOrNull(formData, "purchased_at");
    if (!purchasedAt) throw new Error("Purchased at date is required.");

    const { error: purchaseError } = await supabase.from("purchase").insert({
      collectible_id: collectible.id,
      edition_id: editionId,
      condition,
      status: purchaseStatus,
      purchased_at: purchasedAt,
      store_name: text(formData, "store_name") || null,
      receipt_url: text(formData, "receipt_url") || null,
      purchase_price: decimalOrNull(formData, "purchase_price"),
      tax_amount: decimalOrNull(formData, "tax_amount"),
      shipping_cost: decimalOrNull(formData, "shipping_cost"),
      total_cost: decimalOrNull(formData, "total_cost"),
      resale_date: dateOrNull(formData, "resale_date"),
      resale_price: decimalOrNull(formData, "resale_price"),
      lot_id: lotId,
      serial_number: text(formData, "serial_number") || null,
      location: text(formData, "location") || null,
      notes: text(formData, "purchase_notes") || null,
      created_at: now,
      updated_at: now,
    });

    if (purchaseError) throw new Error(purchaseError.message);
  }

  const files = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (files.length > 0) {
    await uploadImages({
      supabase,
      userId: user.id,
      collectibleId: collectible.id,
      editionId,
      files,
    });
  }

  redirect("/firstoflast/collection");
}

async function updateRecord(
  table: string,
  id: number,
  values: UpdateValues
) {
  const { supabase } = await requireAdmin();

  const payload: UpdateValues = {};

  for (const [key, value] of Object.entries(values)) {
    if (BLOCKED_UPDATE_FIELDS.has(key)) continue;
    payload[key] = value;
  }

  payload.updated_at = nowIso();

  const { error } = await supabase.from(table).update(payload).eq("id", id);

  if (error) throw new Error(error.message);
}

async function deleteRecord(table: string, id: number) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteCollectible(id: number) {
  await deleteRecord("collectible", id);
  redirect("/firstoflast/collection");
}

export async function updateCategory(id: number, values: UpdateValues) {
  await updateRecord("category", id, values);
}

export async function deleteCategory(id: number) {
  await deleteRecord("category", id);
}

export async function updateSubtype(id: number, values: UpdateValues) {
  await updateRecord("subtype", id, values);
}

export async function deleteSubtype(id: number) {
  await deleteRecord("subtype", id);
}

export async function updateBrand(id: number, values: UpdateValues) {
  await updateRecord("brand", id, values);
}

export async function deleteBrand(id: number) {
  await deleteRecord("brand", id);
}

export async function updateFranchise(id: number, values: UpdateValues) {
  await updateRecord("franchise", id, values);
}

export async function deleteFranchise(id: number) {
  await deleteRecord("franchise", id);
}

export async function updateCharacter(id: number, values: UpdateValues) {
  await updateRecord("character", id, values);
}

export async function deleteCharacter(id: number) {
  await deleteRecord("character", id);
}

export async function updateSeries(id: number, values: UpdateValues) {
  await updateRecord("series", id, values);
}

export async function deleteSeries(id: number) {
  await deleteRecord("series", id);
}

export async function updateLot(id: number, values: UpdateValues) {
  await updateRecord("lot", id, values);
}

export async function deleteLot(id: number) {
  await deleteRecord("lot", id);
}