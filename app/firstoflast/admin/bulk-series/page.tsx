import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import BulkSeriesForm from "./BulkSeriesForm";

export default async function BulkSeriesPage() {
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

  const [
    { data: categories },
    { data: subtypes },
    { data: brands },
    { data: franchises },
    { data: characters },
    { data: series },
  ] = await Promise.all([
    supabase.from("category").select("id,name,icon").order("name"),
    supabase.from("subtype").select("id,name,category_id").order("name"),
    supabase.from("brand").select("id,name").order("name"),
    supabase.from("franchise").select("id,name").order("name"),
    supabase.from("character").select("id,name,franchise_id,notes").order("name"),
    supabase
      .from("series")
      .select("id,name,franchise_id,format,total_units")
      .order("name"),
  ]);

  return (
    <div className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              FirstOfLast Admin
            </p>

            <h1 className="text-4xl font-semibold">Bulk Add Series Items</h1>

            <p className="mt-4 text-gray-400">
              Add multiple collectibles for one series at once.
            </p>
          </div>

          <Link
            href="/firstoflast/admin/new"
            className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-300 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Back
          </Link>
        </div>

        <BulkSeriesForm
          categories={categories || []}
          subtypes={subtypes || []}
          brands={brands || []}
          franchises={franchises || []}
          characters={characters || []}
          series={series || []}
        />
      </div>
    </div>
  );
}