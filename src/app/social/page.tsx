import { Suspense } from "react";
import Social from "@/components/Social";
import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function SocialPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }
  return (
    <Suspense
      fallback={<div className="text-white p-8">Loading social hub...</div>}
    >
      <Social />
    </Suspense>
  );
}
