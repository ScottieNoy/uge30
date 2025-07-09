// lib/getCurrentStage.ts
import { createClient } from "@/lib/supabaseClient";

export async function getCurrentStage(): Promise<string | null> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD

  const { data: stages, error } = await supabase
    .from("stages")
    .select("id, date")
    .order("date", { ascending: true });

  if (error || !stages) {
    console.error("Error fetching stages:", error);
    return null;
  }

  // Find the stage with the closest date <= today
  const currentStage = stages
    .filter((s) => s.date && s.date <= today)
    .slice(-1)[0];

  return currentStage?.id ?? null;
}
