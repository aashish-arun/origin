"use client";

import { useState } from "react";
import Image from "next/image";

export type GalleryImage = {
  id: number;
  image_url: string;
  storage_path: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  created_at: string;
  uploaded_device: string | null;
  taken_year: number | null;
  taken_month: number | null;
  taken_day: number | null;
  gallery_image_tag?: {
    gallery_tag: {
      id: number;
      name: string;
    };
  }[];
};

type Props = {
  images: GalleryImage[];
  admin: boolean;
  deleteMode: boolean;
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function GalleryGrid({
  images,
  admin,
  deleteMode,
  selectedIds,
  setSelectedIds,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  function toggleImageSelection(id: number) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((imageId) => imageId !== id)
        : [...current, id]
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {images.map((image) => {
          const isSelected = selectedIds.includes(image.id);

          return (
            <button
              key={image.id}
              type="button"
              onClick={() =>
                deleteMode
                  ? toggleImageSelection(image.id)
                  : setSelectedImage(image)
              }
              className={`relative overflow-hidden rounded-3xl border bg-white/[0.03] transition ${
                isSelected
                  ? "border-red-400 ring-2 ring-red-400"
                  : "border-white/10 hover:border-cyan-400/60"
              }`}
            >
              <Image
                src={image.image_url}
                alt="Gallery image"
                width={600}
                height={600}
                className={`aspect-square w-full object-cover ${
                  deleteMode && !isSelected ? "opacity-60" : ""
                }`}
              />

              {deleteMode && (
                <div className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white">
                  {isSelected ? "Selected" : "Select"}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedImage && !deleteMode && (
        <div
          className="fixed inset-0 z-50 bg-black/95 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="mx-auto grid h-full max-w-7xl gap-6 lg:grid-cols-[1fr_360px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center">
              <img
                src={selectedImage.image_url}
                alt="Selected gallery image"
                className="max-h-[90vh] max-w-full rounded-2xl object-contain"
              />
            </div>

            <aside className="overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Image Details</h2>

                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-3xl text-zinc-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              {admin && (
                <div className="mb-6">
                  <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">
                    Visibility
                  </p>
                  <p>
                    {selectedImage.visibility === "PRIVATE"
                      ? "Private"
                      : "Public"}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">
                  Uploaded
                </p>
                <p>
                  {new Date(selectedImage.created_at).toLocaleDateString(
                    "en-CA"
                  )}
                </p>
              </div>

              <div className="mb-6">
                <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">
                  Taken Date
                </p>
                <p>
                  {selectedImage.taken_year && selectedImage.taken_month
                    ? `${selectedImage.taken_year}-${String(
                        selectedImage.taken_month
                      ).padStart(2, "0")}-${String(
                        selectedImage.taken_day ?? 1
                      ).padStart(2, "0")}`
                    : "Unknown"}
                </p>
              </div>

              <div className="mb-6">
                <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">
                  Device
                </p>
                <p>{selectedImage.uploaded_device || "Unknown"}</p>
              </div>

              <div>
                <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
                  Tags
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedImage.gallery_image_tag?.length ? (
                    selectedImage.gallery_image_tag.map(({ gallery_tag }) => (
                      <span
                        key={gallery_tag.id}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
                      >
                        {gallery_tag.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">No tags</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}