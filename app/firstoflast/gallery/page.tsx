import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import GalleryManager from "./GalleryManager";
import { GalleryImage } from "./GalleryGrid";

function getMonthYearLabel(image: GalleryImage) {
  if (!image.taken_year || !image.taken_month) return "Unknown";

  return new Date(image.taken_year, image.taken_month - 1).toLocaleDateString(
    "en-CA",
    {
      month: "long",
      year: "numeric",
    }
  );
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ showAll?: string }>;
}) {
  const params = await searchParams;
  const showAll = params.showAll === "true";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: admin } = user
    ? await supabase
        .from("admin")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle()
    : { data: null };

  let query = supabase
    .from("gallery_image")
    .select(`
      *,
      gallery_image_tag (
        gallery_tag (
          id,
          name
        )
      )
    `)
    .order("taken_year", { ascending: false, nullsFirst: false })
    .order("taken_month", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (!admin || !showAll) {
    query = query.eq("visibility", "PUBLIC");
  }

  const { data, error } = await query;

  if (error) {
    console.error("Gallery query error:", JSON.stringify(error, null, 2));
  }

  const images = (data ?? []) as GalleryImage[];

  const groupedImages = images.reduce<Record<string, GalleryImage[]>>(
    (groups, image) => {
      const label = getMonthYearLabel(image);

      if (!groups[label]) {
        groups[label] = [];
      }

      groups[label].push(image);

      return groups;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              FirstOfLast
            </p>

            <h1 className="text-4xl font-semibold">Gallery</h1>

            <p className="mt-4 max-w-2xl text-gray-400">
              A visual archive of collection images, displays, moments, and
              private references.
            </p>
          </div>

          {admin && images.length === 0 && (
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

                <span>
                  {showAll ? "Showing All Images" : "Show Private Images"}
                </span>
              </Link>

              <Link
                href="/firstoflast/admin/gallery"
                className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300"
              >
                + Upload Images
              </Link>
            </div>
          )}
        </div>

        {images.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              ✦ Empty Gallery
            </p>

            <h2 className="text-2xl font-semibold">No images yet</h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
              Start building your FirstOfLast visual archive by uploading
              collection photos, display shots, references, or moments.
            </p>

            {admin && (
              <Link
                href="/firstoflast/admin/gallery"
                className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
              >
                + Upload First Images
              </Link>
            )}
          </div>
        ) : (
          <GalleryManager
            groupedImages={groupedImages}
            showAll={showAll}
            admin={!!admin}
          />
        )}
      </div>
    </div>
  );
}