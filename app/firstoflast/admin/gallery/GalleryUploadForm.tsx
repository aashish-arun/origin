"use client";

import { useEffect, useState } from "react";
import { uploadGalleryImages } from "./actions";

type GalleryTag = {
  id: number;
  name: string;
};

type Props = {
  existingTags: GalleryTag[];
};

function detectBrowserDevice() {
  const ua = navigator.userAgent;

  if (/iPhone/i.test(ua)) return "iPhone";
  if (/iPad/i.test(ua)) return "iPad";
  if (/Android/i.test(ua)) return "Android Device";
  if (/Windows/i.test(ua)) return "Windows PC";
  if (/Macintosh/i.test(ua)) return "Mac";
  if (/Linux/i.test(ua)) return "Linux PC";

  return "";
}

async function detectImageDevice(file: File) {
  try {
    const exifr = await import("exifr");

    const metadata = await exifr.parse(file);

    if (metadata?.Make && metadata?.Model) {
      return `${metadata.Make} ${metadata.Model}`;
    }

    if (metadata?.Model) {
      return metadata.Model;
    }

    if (metadata?.Make) {
      return metadata.Make;
    }
  } catch (error) {
    console.log("EXIF detection failed:", error);
  }

  return detectBrowserDevice();
}

export default function GalleryUploadForm({
  existingTags,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<
    "PUBLIC" | "PRIVATE"
  >("PRIVATE");

  const [device, setDevice] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const [fileInputKey, setFileInputKey] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const urls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  async function handleFileChange(selectedFiles: File[]) {
    setFiles(selectedFiles);

    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedFiles.length) {
      setDevice("");
      return;
    }

    const detectedDevice = await detectImageDevice(
      selectedFiles[0]
    );

    setDevice(detectedDevice);
  }

  async function handleSubmit(formData: FormData) {
    if (!files.length) {
      setErrorMessage(
        "Please select at least one image."
      );
      return;
    }

    setIsUploading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      files.forEach((file) => {
        formData.append("images", file);
      });

      formData.append("visibility", visibility);
      formData.append("device", device);
      formData.append("tags", selectedTag);

      await uploadGalleryImages(formData);

      setSuccessMessage(
        "Images uploaded successfully."
      );

      setFiles([]);
      setDevice("");
      setSelectedTag("");

      setFileInputKey((current) => current + 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload images."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="relative">
      {(successMessage || errorMessage) && (
        <div className="fixed right-6 top-24 z-50">
          <div
            className={`rounded-2xl border px-5 py-4 text-sm shadow-2xl ${
              successMessage
                ? "border-cyan-400/40 bg-cyan-400 text-black"
                : "border-red-400/40 bg-red-500 text-white"
            }`}
          >
            {successMessage || errorMessage}
          </div>
        </div>
      )}

      <form
        action={handleSubmit}
        className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
      >
        {/* Images */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Images
          </label>

          <input
            key={fileInputKey}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              handleFileChange(
                Array.from(e.target.files ?? [])
              )
            }
            className="w-full rounded-lg border border-zinc-700 bg-black p-3 text-sm"
          />

          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800 bg-black"
                >
                  <img
                    src={previewUrls[index]}
                    alt={file.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="truncate text-xs text-white">
                      {file.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Visibility
          </label>

          <select
            value={visibility}
            onChange={(e) =>
              setVisibility(
                e.target.value as "PUBLIC" | "PRIVATE"
              )
            }
            className="w-full rounded-lg border border-zinc-700 bg-black p-3"
          >
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public</option>
          </select>
        </div>

        {/* Device */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Uploaded Device
          </label>

          <input
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-black p-3"
          />

          <p className="text-xs text-zinc-500">
            Automatically detected from image EXIF
            data when available.
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Additional Tag
          </label>

          <select
            value={selectedTag}
            onChange={(e) =>
              setSelectedTag(e.target.value)
            }
            className="w-full rounded-lg border border-zinc-700 bg-black p-3"
          >
            <option value="">No extra tag</option>

            {existingTags.map((tag) => (
              <option
                key={tag.id}
                value={tag.name}
              >
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isUploading}
          className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading
            ? "Uploading..."
            : "Upload Images"}
        </button>
      </form>
    </div>
  );
}