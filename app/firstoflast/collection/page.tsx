import { createClient } from "@/lib/supabase/server";

type Collectible = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  brand: { name: string }[] | null;
  category: { name: string }[] | null;
  franchise: { name: string }[] | null;
};

export default async function CollectionPage() {
  const supabase = await createClient();

  const { data: collectibles } = await supabase
    .from("collectible")
    .select(`
      id,
      title,
      description,
      image_url,
      brand:brand_id(name),
      category:category_id(name),
      franchise:franchise_id(name)
    `)
    .order("created_at", { ascending: false });

  // ✅ EMPTY STATE (like gallery style)
  if (!collectibles || collectibles.length === 0) {
    return (
      <div className="min-h-[calc(100vh-160px)] bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            FirstOfLast
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Collection
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400">
            A curated archive of collectibles, figures, franchises, and series
            will appear here.
          </p>
        </div>
      </div>
    );
  }

  // ✅ NORMAL GRID
  return (
    <div className="min-h-[calc(100vh-160px)] bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <section className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            FirstOfLast
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Collection Showcase
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400">
            A curated archive of collectibles, figures, franchises, and series.
          </p>
        </section>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collectibles.map((item: Collectible) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm"
            >
              <div className="flex h-72 items-center justify-center bg-black/40">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-contain p-4"
                  />
                ) : (
                  <span className="text-sm text-gray-500">No image</span>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {item.category?.[0]?.name && (
                    <span className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-300">
                      {item.category[0].name}
                    </span>
                  )}

                  {item.franchise?.[0]?.name && (
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300">
                      {item.franchise[0].name}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold">{item.title}</h2>

                {item.brand?.[0]?.name && (
                  <p className="mt-1 text-sm text-gray-500">
                    {item.brand[0].name}
                  </p>
                )}

                {item.description && (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                    {item.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}