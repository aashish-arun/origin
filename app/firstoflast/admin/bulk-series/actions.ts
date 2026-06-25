"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const NEW_VALUE = "__new__";

type CollectibleStatus = "OWNED" | "PLANNED" | "WISHLIST";
type ReferenceType = "WIKIPEDIA" | "OFFICIAL" | "FANDOM" | "OTHER";

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

function numberRequired(formData: FormData, key: string) {
  const value = Number(text(formData, key));

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

function numberOrNull(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value || value === NEW_VALUE) return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
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

async function uploadItemImages({
  supabase,
  userId,
  collectibleId,
  files,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  collectibleId: number;
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

  if (uploadedUrls.length > 0) {
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
        url,
        created_at: now,
      }))
    );

    if (mediaError) throw new Error(mediaError.message);
  }
}

export async function bulkCreateSeriesItems(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  let franchiseId = numberOrNull(formData, "franchise_id");
  let seriesId = numberOrNull(formData, "series_id");
  let categoryId = numberOrNull(formData, "category_id");
  let subtypeId = numberOrNull(formData, "subtype_id");
  let brandId = numberOrNull(formData, "brand_id");

  const itemCount = numberRequired(formData, "item_count");
  const defaultDescription = text(formData, "default_description");

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

  if (!franchiseId) throw new Error("Franchise is required.");

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

  if (text(formData, "series_id") === NEW_VALUE) {
    const name = text(formData, "new_series_name");
    const format = text(formData, "new_series_format") || "OTHER";
    const notes = text(formData, "new_series_notes");
    const totalUnits = numberOrNull(formData, "new_series_total_units");

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

  if (!seriesId) throw new Error("Series is required.");

  const franchiseName = await getNameById(supabase, "franchise", franchiseId);
  const brandName = await getNameById(supabase, "brand", brandId);
  const subtypeName = await getNameById(supabase, "subtype", subtypeId);

  for (let index = 0; index < itemCount; index += 1) {
    const now = nowIso();

    const seriesNumber = numberRequired(formData, `item_${index}_series_number`);
    const status = text(formData, `item_${index}_status`) as CollectibleStatus;
    const customTitle = text(formData, `item_${index}_custom_title`);
    const itemDescription = text(formData, `item_${index}_description`);

    let characterId = numberOrNull(formData, `item_${index}_character_id`);

    if (text(formData, `item_${index}_character_id`) === NEW_VALUE) {
      const newCharacterName = text(
        formData,
        `item_${index}_new_character_name`
      );

      const newCharacterNotes = text(
        formData,
        `item_${index}_new_character_notes`
      );

      const newCharacterReferenceUrl = text(
        formData,
        `item_${index}_new_character_reference_url`
      );

      const newCharacterReferenceLabel = text(
        formData,
        `item_${index}_new_character_reference_label`
      );

      const newCharacterReferenceType = (text(
        formData,
        `item_${index}_new_character_reference_type`
      ) || "OTHER") as ReferenceType;

      if (!["WIKIPEDIA", "OFFICIAL", "FANDOM", "OTHER"].includes(newCharacterReferenceType)) {
        throw new Error(`Invalid character reference type for item row ${index + 1}.`);
      }

      if (!newCharacterName) {
        throw new Error(
          `New character name is required for item row ${index + 1}.`
        );
      }

      const { data: character, error: characterError } = await supabase
        .from("character")
        .insert(
          withTimestamps({
            name: newCharacterName,
            franchise_id: franchiseId,
            notes: newCharacterNotes || null,
          })
        )
        .select("id")
        .single();

      if (characterError) throw new Error(characterError.message);

      characterId = character.id;

      if (newCharacterReferenceUrl) {
        const { error: referenceError } = await supabase
          .from("character_reference")
          .insert({
            character_id: characterId,
            type: newCharacterReferenceType,
            url: newCharacterReferenceUrl,
            label: newCharacterReferenceLabel || null,
            created_at: nowIso(),
          });

        if (referenceError) throw new Error(referenceError.message);
      }
    }

    if (!characterId) {
      throw new Error(`Character is required for item row ${index + 1}.`);
    }

    if (!["OWNED", "PLANNED", "WISHLIST"].includes(status)) {
      throw new Error(`Invalid status for item row ${index + 1}.`);
    }

    const characterName = await getNameById(
      supabase,
      "character",
      characterId
    );

    const generatedTitle = [
      franchiseName,
      characterName,
      brandName,
      subtypeName,
    ]
      .filter(Boolean)
      .join(" ");

    const title = customTitle || generatedTitle;

    if (!title) {
      throw new Error(`Title could not be generated for row ${index + 1}.`);
    }

    const { data: collectible, error } = await supabase
      .from("collectible")
      .insert({
        title,
        description: itemDescription || defaultDescription || null,
        image_url: null,
        status,
        brand_id: brandId,
        category_id: categoryId,
        subtype_id: subtypeId,
        franchise_id: franchiseId,
        character_id: characterId,
        series_id: seriesId,
        series_number: seriesNumber,
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    const files = formData
      .getAll(`item_${index}_images`)
      .filter((file): file is File => file instanceof File && file.size > 0);

    if (files.length > 0) {
      await uploadItemImages({
        supabase,
        userId: user.id,
        collectibleId: collectible.id,
        files,
      });
    }
  }

  redirect("/firstoflast/collection");
}