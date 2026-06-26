import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GalleryUploadForm from "./GalleryUploadForm";

function isDateTag(tag: string) {
  return (
    /^\d{4}$/.test(tag) ||
    /^\d{4}-\d{2}$/.test(tag) ||
    /^\d{4}-\d{2}-\d{2}$/.test(tag)
  );
}

export default async function AdminGalleryPage() {
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

  const { data: tags } = await supabase
    .from("gallery_tag")
    .select("id,name")
    .order("name");

  const filteredTags = (tags ?? []).filter((tag) => !isDateTag(tag.name));

  return (
    <div className="min-h-[calc(100vh-160px)] bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            FirstOfLast Admin
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">
            Upload Gallery Images
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Upload one image or bulk upload many images. Add visibility, device,
            and tags during upload.
          </p>
        </div>

        <GalleryUploadForm existingTags={filteredTags} />
      </div>
    </div>
  );
}