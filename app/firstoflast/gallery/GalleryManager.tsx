"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteGalleryImages } from "../admin/gallery/actions";
import GalleryGrid, { GalleryImage } from "./GalleryGrid";

type Props = {
  groupedImages: Record<string, GalleryImage[]>;
  showAll: boolean;
  admin: boolean;
};

export default function GalleryManager({
  groupedImages,
  showAll,
  admin,
}: Props) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDeleteSelected() {
    if (!selectedIds.length) return;

    setIsDeleting(true);
    setMessage("");

    try {
      await deleteGalleryImages(selectedIds);

      setSelectedIds([]);
      setDeleteMode(false);
      setShowDeleteConfirm(false);
      setMessage("Images deleted successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to delete images."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {admin && (
        <div className="-mt-[104px] mb-10 flex justify-end">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={
                showAll
                  ? "/firstoflast/gallery"
                  : "/firstoflast/gallery?showAll=true"
              }
              className={`flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium transition ${
                showAll
                  ? "border-cyan-400 bg-cyan-400 text-black"
                  : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-cyan-400"
              }`}
            >
              <span
                className={`relative h-5 w-10 rounded-full transition ${
                  showAll ? "bg-black/30" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition ${
                    showAll ? "left-5" : "left-1"
                  }`}
                />
              </span>

              <span>{showAll ? "Showing All Images" : "Show Private Images"}</span>
            </Link>

            <Link
              href="/firstoflast/admin/gallery"
              className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300"
            >
              + Upload Images
            </Link>

            <button
              type="button"
              onClick={() => {
                setDeleteMode((current) => !current);
                setSelectedIds([]);
                setShowDeleteConfirm(false);
                setMessage("");
              }}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                deleteMode
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
              }`}
            >
              {deleteMode ? "Cancel Delete" : "Delete Images"}
            </button>

            {deleteMode && (
              <button
                type="button"
                disabled={!selectedIds.length || isDeleting}
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting
                  ? "Deleting..."
                  : `Confirm Delete (${selectedIds.length})`}
              </button>
            )}
          </div>
        </div>
      )}

      {message && (
        <div className="mb-6 rounded-2xl border border-cyan-400/30 bg-cyan-400 px-4 py-3 text-sm font-medium text-black">
          {message}
        </div>
      )}

      <div className="space-y-12">
        {Object.entries(groupedImages).map(([group, groupImages]) => (
          <section key={group}>
            <div className="mb-4 border-b border-white/10 pb-3">
              <h2 className="text-lg font-semibold text-white">{group}</h2>
            </div>

            <GalleryGrid
              images={groupImages}
              admin={admin}
              deleteMode={deleteMode}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          </section>
        ))}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white">
              Delete Images?
            </h2>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              You are about to permanently delete{" "}
              <span className="font-semibold text-white">
                {selectedIds.length}
              </span>{" "}
              image{selectedIds.length !== 1 ? "s" : ""}.
            </p>

            <p className="mt-2 text-sm text-red-400">
              This action cannot be undone.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl border border-zinc-700 px-5 py-3 text-sm text-zinc-300 transition hover:border-white"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteSelected}
                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}