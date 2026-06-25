import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ManageDataClient from "./ManageDataClient";

export default async function ManageDataPage() {
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
    supabase.from("category").select("*").order("name"),
    supabase.from("subtype").select("*").order("name"),
    supabase.from("brand").select("*").order("name"),
    supabase.from("franchise").select("*").order("name"),
    supabase.from("character").select("*").order("name"),
    supabase.from("series").select("*").order("name"),
  ]);

  return (
    <div className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              FirstOfLast Admin
            </p>

            <h1 className="text-4xl font-semibold">Manage Data</h1>

            <p className="mt-4 text-gray-400">
              Edit and delete lookup records. Internal fields are locked.
            </p>
          </div>

          <Link
            href="/firstoflast/admin/new"
            className="rounded-full border border-white/10 px-5 py-2 text-sm text-gray-300 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Back
          </Link>
        </div>

        <ManageDataClient
          categories={categories ?? []}
          subtypes={subtypes ?? []}
          brands={brands ?? []}
          franchises={franchises ?? []}
          characters={characters ?? []}
          series={series ?? []}
        />
      </div>
    </div>
  );
}