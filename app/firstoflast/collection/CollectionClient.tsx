"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Collectible, RelationValue } from "./page";
import { deleteCollectible } from "../admin/new/actions";

type FilterKey =
  | "all"
  | "status"
  | "category"
  | "subtype"
  | "brand"
  | "franchise"
  | "character"
  | "series";

type RelationFilterKey = Exclude<FilterKey, "all" | "status">;
type ViewMode = "series" | "grid" | "list" | "compact";

function relationObject(value: RelationValue) {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] || null;
  return value;
}

function getName(item: Collectible, key: RelationFilterKey) {
  return relationObject(item[key])?.name || "";
}

function getSeriesTotalUnits(item: Collectible) {
  return relationObject(item.series)?.total_units || 0;
}

function getCharacterReferences(item: Collectible) {
  return relationObject(item.character)?.references || [];
}

function getEditionLabel(item: Collectible) {
  const edition = item.editions?.[0];

  if (!edition) return "";

  return (
    edition.edition_name ||
    edition.exclusive_label ||
    (edition.edition_number ? `Edition #${edition.edition_number}` : "")
  );
}

function getPurchaseLabel(item: Collectible) {
  const purchase = item.purchases?.[0];

  if (!purchase) return "";

  return [purchase.condition, purchase.status].filter(Boolean).join(" • ");
}

function getStatusLabel(status: Collectible["status"]) {
  if (status === "OWNED") return "Owned";
  if (status === "PLANNED") return "Planned";
  return "Wishlist";
}

function isPlannedItem(item: Collectible) {
  return item.status === "PLANNED" || item.status === "WISHLIST";
}

function getDisplayTitle(item: Collectible) {
  return getName(item, "character") || item.title;
}

function getSeriesTitle(group: { name: string; items: Collectible[] }) {
  const first = group.items[0];

  if (!first || group.name === "No Series") return "No Series";

  const franchise = getName(first, "franchise");
  const subtype = getName(first, "subtype");
  const brand = getName(first, "brand");

  const title = [franchise, group.name, subtype].filter(Boolean).join(" • ");

  return brand ? `${title} by ${brand}` : title;
}

export default function CollectionClient({
  collectibles,
  isAdmin,
}: {
  collectibles: Collectible[];
  isAdmin: boolean;
}) {
  const [search, setSearch] = useState("");
  const [filterKey, setFilterKey] = useState<FilterKey>("all");
  const [filterValue, setFilterValue] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("series");

  const filterOptions = useMemo(() => {
    if (filterKey === "all") return [];

    if (filterKey === "status") {
      return ["OWNED", "PLANNED", "WISHLIST"];
    }

    const values = collectibles
      .map((item) => getName(item, filterKey))
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [collectibles, filterKey]);

  const filteredCollectibles = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return collectibles.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.status,
        getStatusLabel(item.status),
        getName(item, "brand"),
        getName(item, "category"),
        getName(item, "subtype"),
        getName(item, "franchise"),
        getName(item, "character"),
        getName(item, "series"),
        getEditionLabel(item),
        getPurchaseLabel(item),
        ...getCharacterReferences(item).map((reference) => reference.label || reference.type),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchTerm === "" || searchableText.includes(searchTerm);

      const matchesFilter =
        filterKey === "all" ||
        filterValue === "all" ||
        (filterKey === "status"
          ? item.status === filterValue
          : getName(item, filterKey) === filterValue);

      return matchesSearch && matchesFilter;
    });
  }, [collectibles, search, filterKey, filterValue]);

  const seriesGroups = useMemo(() => {
    const map = new Map<
      string,
      {
        id: number | null;
        name: string;
        totalUnits: number;
        items: Collectible[];
      }
    >();

    filteredCollectibles.forEach((item) => {
      const name = getName(item, "series") || "No Series";
      const key = `${item.series_id || "none"}-${name}`;

      if (!map.has(key)) {
        map.set(key, {
          id: item.series_id,
          name,
          totalUnits: getSeriesTotalUnits(item),
          items: [],
        });
      }

      map.get(key)?.items.push(item);
    });

    return Array.from(map.values()).map((group) => ({
      ...group,
      items: [...group.items].sort((a, b) => {
        const aNumber = a.series_number ?? 9999;
        const bNumber = b.series_number ?? 9999;
        return (
          aNumber - bNumber ||
          getDisplayTitle(a).localeCompare(getDisplayTitle(b))
        );
      }),
    }));
  }, [filteredCollectibles]);

  if (collectibles.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Empty Collection
        </p>

        <h2 className="text-3xl font-semibold text-white">
          No collectibles yet
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-400">
          Start by adding your first collectible or bulk-create items for a full series.
        </p>

        {isAdmin && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/firstoflast/admin/new"
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-300"
            >
              + Add Collectible
            </Link>

            <Link
              href="/firstoflast/admin/bulk-series"
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              Bulk Add Series
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
          <input
            type="text"
            placeholder="Search by title, character, status, brand, category, franchise, variant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-cyan-400"
          />

          <select
            value={filterKey}
            onChange={(e) => {
              setFilterKey(e.target.value as FilterKey);
              setFilterValue("all");
            }}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
          >
            <option value="all">Filter by</option>
            <option value="status">Status</option>
            <option value="category">Category</option>
            <option value="subtype">Subtype</option>
            <option value="brand">Brand</option>
            <option value="franchise">Franchise</option>
            <option value="character">Character</option>
            <option value="series">Series</option>
          </select>

          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            disabled={filterKey === "all"}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 focus:border-cyan-400"
          >
            <option value="all">All</option>

            {filterOptions.map((value) => (
              <option key={value} value={value}>
                {filterKey === "status"
                  ? getStatusLabel(value as Collectible["status"])
                  : value}
              </option>
            ))}
          </select>

          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
          >
            <option value="series">Series Showcase</option>
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
            <option value="compact">Compact View</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
          <p>
            Showing {filteredCollectibles.length} of {collectibles.length} items
          </p>

          {(search || filterKey !== "all" || filterValue !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilterKey("all");
                setFilterValue("all");
              }}
              className="text-cyan-400 transition hover:text-cyan-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredCollectibles.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold">No matching items</h2>
          <p className="mt-3 text-gray-400">
            Try changing your search or filter.
          </p>
        </div>
      ) : viewMode === "series" ? (
        <SeriesShowcase groups={seriesGroups} isAdmin={isAdmin} />
      ) : viewMode === "list" ? (
        <div className="space-y-5">
          {filteredCollectibles.map((item) => (
            <ListCard key={item.id} item={item} isAdmin={isAdmin} />
          ))}
        </div>
      ) : viewMode === "compact" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCollectibles.map((item) => (
            <CompactCard key={item.id} item={item} isAdmin={isAdmin} />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCollectibles.map((item) => (
            <GridCard key={item.id} item={item} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </>
  );
}

function SeriesShowcase({
  groups,
  isAdmin,
}: {
  groups: {
    id: number | null;
    name: string;
    totalUnits: number;
    items: Collectible[];
  }[];
  isAdmin: boolean;
}) {
  return (
    <section className="space-y-8">
      {groups.map((group) => {
        const owned = group.items.filter(
          (item) => item.status === "OWNED"
        ).length;

        const total = group.totalUnits || group.items.length;
        const percentage = total > 0 ? Math.round((owned / total) * 100) : 0;

        const enteredNumbers = new Set(
          group.items
            .map((item) => item.series_number)
            .filter((value): value is number => typeof value === "number")
        );

        const missingNumbers =
          group.totalUnits > 0
            ? Array.from({ length: group.totalUnits }, (_, index) => index + 1).filter(
                (number) => !enteredNumbers.has(number)
              )
            : [];

        const sampleItem = group.items[0];

        const addMissingHref =
          sampleItem && missingNumbers.length > 0
            ? `/firstoflast/admin/bulk-series?${new URLSearchParams({
                franchise_id: String(sampleItem.franchise_id ?? ""),
                series_id: String(sampleItem.series_id ?? ""),
                category_id: String(sampleItem.category_id ?? ""),
                subtype_id: String(sampleItem.subtype_id ?? ""),
                brand_id: String(sampleItem.brand_id ?? ""),
                missing_numbers: missingNumbers.join(","),
              }).toString()}`
            : "/firstoflast/admin/bulk-series";

        return (
          <div
            key={`${group.id}-${group.name}`}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
                  Series
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold">
                    {getSeriesTitle(group)}
                  </h2>

                  {isAdmin && missingNumbers.length > 0 && (
                    <Link
                      href={addMissingHref}
                      title={`${missingNumbers.length} collectible slots have not yet been created for this series.

                Missing numbers: ${missingNumbers.map((number) => `#${number}`).join(", ")}

                Add Missing Collectibles`}
                      className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300 transition hover:bg-amber-400 hover:text-black"
                    >
                      ⚠️ Add Missing ones
                    </Link>
                  )}
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  {owned} / {total} owned
                </p>
              </div>

              <span className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300">
                {percentage}% complete
              </span>
            </div>

            <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-2 rounded-full bg-cyan-400"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {group.items.map((item) => (
                <SeriesItemCard key={item.id} item={item} isAdmin={isAdmin} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function SeriesItemCard({
  item,
  isAdmin,
}: {
  item: Collectible;
  isAdmin: boolean;
}) {
  return (
    <article className={cardClass(item, "rounded-3xl p-4")}>
      <ImageBlock item={item} height="h-44" />

      <div className="mt-4 text-center">
        <div className="flex justify-center">
          <Badges item={item} />
        </div>

        <h2 className="line-clamp-1 text-lg font-semibold text-white">
          {getDisplayTitle(item)}
        </h2>

        <div className="flex justify-center">
          <MetaDetails item={item} compact />
        </div>

        {isAdmin && (
          <div className="flex justify-center">
            <DeleteButton item={item} />
          </div>
        )}
      </div>
    </article>
  );
}

function GridCard({
  item,
  isAdmin,
}: {
  item: Collectible;
  isAdmin: boolean;
}) {
  return (
    <article className={cardClass(item, "overflow-hidden rounded-3xl")}>
      <ImageBlock item={item} height="h-72" />

      <div className="p-6">
        <Badges item={item} />
        <h2 className="text-xl font-semibold">{getDisplayTitle(item)}</h2>
        <MetaDetails item={item} />
        {isAdmin && <DeleteButton item={item} />}
      </div>
    </article>
  );
}

function ListCard({
  item,
  isAdmin,
}: {
  item: Collectible;
  isAdmin: boolean;
}) {
  return (
    <article
      className={cardClass(
        item,
        "grid overflow-hidden rounded-3xl sm:grid-cols-[220px_1fr]"
      )}
    >
      <ImageBlock item={item} height="h-56 sm:h-full" />

      <div className="p-6">
        <Badges item={item} />
        <h2 className="text-2xl font-semibold">{getDisplayTitle(item)}</h2>
        {item.description && (
          <p className="mt-3 max-w-3xl text-sm text-gray-400">
            {item.description}
          </p>
        )}
        <MetaDetails item={item} />
        {isAdmin && <DeleteButton item={item} />}
      </div>
    </article>
  );
}

function CompactCard({
  item,
  isAdmin,
}: {
  item: Collectible;
  isAdmin: boolean;
}) {
  return (
    <article className={cardClass(item, "rounded-3xl p-4")}>
      <ImageBlock item={item} height="h-44" />

      <div className="mt-4">
        <Badges item={item} />

        <h2 className="line-clamp-1 text-lg font-semibold text-white">
          {getDisplayTitle(item)}
        </h2>

        <MetaDetails item={item} compact />

        {isAdmin && <DeleteButton item={item} />}
      </div>
    </article>
  );
}

function MetaDetails({
  item,
  compact = false,
}: {
  item: Collectible;
  compact?: boolean;
}) {
  const editionLabel = getEditionLabel(item);
  const purchaseLabel = getPurchaseLabel(item);
  const references = getCharacterReferences(item);

  return (
    <div className={compact ? "mt-2 space-y-1" : "mt-4 space-y-2"}>
      {editionLabel && (
        <p className="text-xs text-purple-300">Variant: {editionLabel}</p>
      )}

      {purchaseLabel && (
        <p className="text-xs text-emerald-300">Purchase: {purchaseLabel}</p>
      )}

      {!compact &&
        references.map((reference) => (
          <a
            key={reference.id}
            href={reference.url}
            target="_blank"
            rel="noreferrer"
            className="block text-xs text-cyan-300 transition hover:text-cyan-200"
          >
            {reference.label || reference.type} →
          </a>
        ))}
    </div>
  );
}

function cardClass(item: Collectible, extra = "") {
  return `${extra} border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm transition`;
}

function ImageBlock({
  item,
  height,
}: {
  item: Collectible;
  height: string;
}) {
  const imageUrl =
    item.image_url ||
    item.media?.[0]?.url ||
    item.editions?.[0]?.media?.[0]?.url;

  const planned = isPlannedItem(item);

  return (
    <div className={`flex ${height} items-center justify-center bg-black/40`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={item.title}
          className={`h-full w-full object-contain p-4 transition ${
            planned ? "grayscale opacity-40" : ""
          }`}
        />
      ) : (
        <span className="text-sm text-gray-500">No image</span>
      )}
    </div>
  );
}

function DeleteButton({ item }: { item: Collectible }) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (!confirm(`Delete "${item.title}"?`)) return;
        await deleteCollectible(item.id);
        window.location.reload();
      }}
      className="mt-4 rounded-full border border-red-400/30 px-4 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
    >
      Delete
    </button>
  );
}

function Badges({ item }: { item: Collectible }) {
  const editionLabel = getEditionLabel(item);

  return (
    <div className="mb-3 flex flex-wrap justify-center gap-2">
      <StatusBadge status={item.status} />

      {item.series_number && <Badge muted>#{item.series_number}</Badge>}

      {editionLabel && <Badge>Variant</Badge>}

      {item.purchases?.length ? <Badge muted>Purchase</Badge> : null}
    </div>
  );
}

function StatusBadge({ status }: { status: Collectible["status"] }) {
  const planned = status === "PLANNED" || status === "WISHLIST";

  return (
    <span
      className={
        planned
          ? "rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400"
          : "rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-300"
      }
    >
      {getStatusLabel(status)}
    </span>
  );
}

function Badge({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      className={
        muted
          ? "rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300"
          : "rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-300"
      }
    >
      {children}
    </span>
  );
}