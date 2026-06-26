"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function uploadGalleryImages(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const files = formData.getAll("images") as File[];

  if (!files.length) {
    throw new Error("No images selected");
  }

  const visibility =
    (formData.get("visibility") as "PUBLIC" | "PRIVATE") ?? "PRIVATE";

  const device = (formData.get("device") as string | null)?.trim() || null;

  const customTags =
    (formData.get("tags") as string | null)
      ?.split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean) ?? [];

  for (const file of files) {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    const extension = file.name.split(".").pop();
    const path = `${user.id}/${year}/${month}/${randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(path);

    const { data: image, error: imageError } = await supabase
      .from("gallery_image")
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        storage_path: path,
        visibility,
        uploaded_device: device,
        taken_year: year,
        taken_month: month,
        taken_day: day,
      })
      .select("id")
      .single();

    if (imageError || !image) {
      throw new Error(imageError?.message);
    }

    const automaticTags = [
      `${year}`,
      `${year}-${String(month).padStart(2, "0")}`,
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`,
    ];

    if (device) {
      automaticTags.push(device.toLowerCase());
    }

    const allTags = [...automaticTags, ...customTags];

    for (const tagName of [...new Set(allTags)]) {
      let { data: tag } = await supabase
        .from("gallery_tag")
        .select("id")
        .eq("name", tagName)
        .maybeSingle();

      if (!tag) {
        const { data: createdTag, error: tagError } = await supabase
          .from("gallery_tag")
          .insert({
            name: tagName,
          })
          .select("id")
          .single();

        if (tagError || !createdTag) {
          continue;
        }

        tag = createdTag;
      }

      await supabase.from("gallery_image_tag").insert({
        image_id: image.id,
        tag_id: tag.id,
      });
    }
  }

  revalidatePath("/firstoflast/gallery");
  revalidatePath("/firstoflast/admin/gallery");
}

export async function deleteGalleryImages(imageIds: number[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: admin } = await supabase
    .from("admin")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) {
    throw new Error("Admin only");
  }

  if (!imageIds.length) {
    throw new Error("No images selected");
  }

  const { data: images, error: fetchError } = await supabase
    .from("gallery_image")
    .select("id, storage_path")
    .in("id", imageIds);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const storagePaths =
    images
      ?.map((image) => image.storage_path)
      .filter((path): path is string => Boolean(path)) ?? [];

  const { error: imageTagError } = await supabase
    .from("gallery_image_tag")
    .delete()
    .in("image_id", imageIds);

  if (imageTagError) {
    throw new Error(imageTagError.message);
  }

  const { error: imageDeleteError } = await supabase
    .from("gallery_image")
    .delete()
    .in("id", imageIds);

  if (imageDeleteError) {
    throw new Error(imageDeleteError.message);
  }

  if (storagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("gallery")
      .remove(storagePaths);

    if (storageError) {
      throw new Error(storageError.message);
    }
  }

  revalidatePath("/firstoflast/gallery");
  revalidatePath("/firstoflast/admin/gallery");
}