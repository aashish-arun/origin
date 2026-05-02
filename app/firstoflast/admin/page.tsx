import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { login } from "./login-action";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/firstoflast");
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-black px-6 py-20 text-white">
      <form
        action={login}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm"
      >
        <p className="mb-2 text-sm font-medium text-cyan-400">
          FirstOfLast Admin
        </p>

        <h1 className="mb-6 text-3xl font-semibold tracking-tight">
          Admin Login
        </h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-black hover:bg-cyan-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}