import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import CollectionClient from "./CollectionClient";

export type CollectibleStatus = "OWNED" | "PLANNED" | "WISHLIST";

export type CharacterReference = {
  id: number;
  type: "WIKIPEDIA" | "OFFICIAL" | "FANDOM" | "OTHER";
  url: string;
  label: string | null;
};

export type RelationValue =
  | {
      id?: number;
      name: string;
      total_units?: number | null;
      references?: CharacterReference[] | null;
    }
  | {
      id?: number;
      name: string;
      total_units?: number | null;
      references?: CharacterReference[] | null;
    }[]
  | null;

export type CollectibleEdition = {
  id: number;
  series_id: number | null;
  edition_number: number | null;
  edition_name: string | null;
  exclusive_label: string | null;
  release_date: string | null;
  edition_size: number | null;
  sku: string | null;
  media: { url: string }[] | null;
};

export type CollectiblePurchase = {
  id: number;
  edition_id: number | null;
  condition: string;
  status: string;
  purchased_at: string;
  store_name: string | null;
  receipt_url: string | null;
  purchase_price: number | null;
  tax_amount: number | null;
  shipping_cost: number | null;
  total_cost: number | null;
  resale_date: string | null;
  resale_price: number | null;
  lot_id: number | null;
  serial_number: string | null;
  location: string | null;
  notes: string | null;
  lot: { id: number; name: string | null } | null;
};

export type Collectible = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  status: CollectibleStatus;

  brand_id: number | null;
  category_id: number | null;
  subtype_id: number | null;
  franchise_id: number | null;
  character_id: number | null;
  series_id: number | null;
  series_number: number | null;

  brand: RelationValue;
  category: RelationValue;
  subtype: RelationValue;
  franchise: RelationValue;
  character: RelationValue;
  series: RelationValue;

  editions: CollectibleEdition[] | null;
  purchases: CollectiblePurchase[] | null;
  media: { url: string }[] | null;
};

export default async function CollectionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data: admin } = await supabase
      .from("admin")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    isAdmin = Boolean(admin);
  }

  const { data: collectibles } = await supabase
    .from("collectible")
    .select(
      `
      id,
      title,
      description,
      image_url,
      status,
      brand_id,
      category_id,
      subtype_id,
      franchise_id,
      character_id,
      series_id,
      series_number,

      brand:brand_id(id,name),
      category:category_id(id,name),
      subtype:subtype_id(id,name),
      franchise:franchise_id(id,name),
      character:character_id(
        id,
        name,
        references:character_reference(
          id,
          type,
          url,
          label
        )
      ),
      series:series_id(id,name,total_units),

      editions:edition(
        id,
        series_id,
        edition_number,
        edition_name,
        exclusive_label,
        release_date,
        edition_size,
        sku,
        media(url)
      ),

      purchases:purchase(
        id,
        edition_id,
        condition,
        status,
        purchased_at,
        store_name,
        receipt_url,
        purchase_price,
        tax_amount,
        shipping_cost,
        total_cost,
        resale_date,
        resale_price,
        lot_id,
        serial_number,
        location,
        notes,
        lot:lot_id(id,name)
      ),

      media(url)
    `
    )
    .order("series_number", { ascending: true })
    .order("title", { ascending: true });

  return (
    <div className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              FirstOfLast
            </p>

            <h1 className="text-4xl font-semibold">Collection Showcase</h1>

            <p className="mt-4 max-w-2xl text-gray-400">
              Track every series, owned item, planned item, wishlist item,
              variants, purchases, and completion progress.
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/firstoflast/admin/new"
              className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300"
            >
              + Create New Item
            </Link>
          )}
        </div>

        <CollectionClient
          collectibles={(collectibles || []) as unknown as Collectible[]}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}