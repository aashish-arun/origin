type AniListEntry = {
  id: number;
  status: string;
  progress: number | null;
  media: {
    id: number;
    type: "ANIME" | "MANGA";
    title: {
      romaji: string | null;
      english: string | null;
    };
    coverImage: {
      large: string | null;
    };
    episodes?: number | null;
    chapters?: number | null;
  };
};

async function getAniListRecent() {
  const username = process.env.ANILIST_USERNAME;

  if (!username) return [];

  const query = `
    query ($userName: String) {
      MediaListCollection(userName: $userName, type: ANIME, sort: UPDATED_TIME_DESC) {
        lists {
          entries {
            id
            status
            progress
            media {
              id
              type
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              episodes
              chapters
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        userName: username,
      },
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const json = await res.json();

  return (
    json?.data?.MediaListCollection?.lists
      ?.flatMap((list: any) => list.entries)
      ?.slice(0, 6) || []
  );
}

export default async function FirstOfLastPage() {
  const recentAnime = await getAniListRecent();

  return (
    <div className="min-h-[calc(100vh-160px)] bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <section className="mb-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            FirstOfLast
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            What I’ve Been Up To
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400">
            A small live corner for what I’ve been watching, reading,
            collecting, and listening to recently.
          </p>
        </section>

        {/* CONTENT */}
        <section className="grid gap-6 lg:grid-cols-3">

          {/* ANILIST */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-400">
                  AniList
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  Recent Anime / Manga
                </h2>
              </div>

              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-gray-400">
                Live
              </span>
            </div>

            {recentAnime.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-gray-400">
                Add this to your environment:
                <pre className="mt-3 rounded-xl bg-black/50 p-4 text-sm text-cyan-300">
{`ANILIST_USERNAME=yourAniListUsername`}
                </pre>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {recentAnime.map((entry: AniListEntry) => {
                  const title =
                    entry.media.title.english ||
                    entry.media.title.romaji ||
                    "Untitled";

                  return (
                    <article
                      key={entry.id}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-black/30"
                    >
                      <div className="flex h-64 items-center justify-center bg-black/40">
                        {entry.media.coverImage.large ? (
                          <img
                            src={entry.media.coverImage.large}
                            alt={title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-gray-500">
                            No image
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="text-xs uppercase tracking-widest text-cyan-400">
                          {entry.media.type}
                        </p>

                        <h3 className="mt-2 line-clamp-2 font-semibold">
                          {title}
                        </h3>

                        <p className="mt-2 text-sm text-gray-400">
                          {entry.status} · Progress {entry.progress ?? 0}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* SIDE PANEL */}
          <div className="space-y-6">

            {/* SPOTIFY */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-medium text-cyan-400">
                Spotify
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Recently Played
              </h2>

              <p className="mt-4 text-sm text-gray-400">
                Spotify integration coming soon.
              </p>
            </section>

            {/* COLLECTION */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-medium text-cyan-400">
                Collection
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Recently Added
              </h2>

              <p className="mt-4 text-sm text-gray-400">
                Your latest collection items will appear here.
              </p>
            </section>

          </div>
        </section>
      </div>
    </div>
  );
}