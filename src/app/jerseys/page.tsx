"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { User } from "@/types";

type Jersey = {
  id: string;
  name: string;
  awarded_at: string;
  holder_id: string;
  holder?: User;
};

// Match jersey categories with their UUIDs
const JERSEY_ID_MAP: Record<string, string> = {
  gyldne_blaerer: "eb3ccde5-3578-49ca-8c4c-0bf216a3506d",
  sprinter: "19c27134-7ded-4a8c-afca-e654e804da36",
  flydende_haand: "5c8c9470-2975-4270-8a0f-a4d04442d7a8",
  førertroje: "9fc6114e-b335-45d8-84b9-0d2d99e68bd7",
  maane: "386c72f2-a97c-41d9-920b-2f0a84e5074f",
  prikket: "2e361c05-7919-4a20-8cb8-336b2d439298",
  paedofil: "eaf70abb-41da-4781-ad04-07ed6ae318b5",
  ungdom: "d05d2ec8-fdb7-4a49-9013-2529d5ac9a35",
};

const JERSEY_CATEGORIES = Object.keys(JERSEY_ID_MAP);

export default function JerseyPage() {
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchAndAssignJerseys = async () => {
      const { data: users } = await supabase.from("users").select("*");
      const { data: points } = await supabase.from("points").select("*");
      if (!users || !points) return;

      const scores: Record<string, Record<string, number>> = {};
      for (const u of users) {
        scores[u.id] = {};
        for (const category of JERSEY_CATEGORIES) {
          scores[u.id][category] = 0;
        }
      }

      for (const p of points) {
        if (scores[p.user_id]) {
          scores[p.user_id][p.category] += p.value;
          scores[p.user_id].førertroje += p.value;
          if (p.user_id !== p.submitted_by && scores[p.submitted_by]) {
            scores[p.submitted_by].flydende_haand += p.value;
          }
        }
      }

      // Assign jerseys to top-scoring non-admins
      for (const category of JERSEY_CATEGORIES) {
        const topUser = users
          .filter((u) => !u.is_admin)
          .map((u) => ({ user: u, total: scores[u.id]?.[category] || 0 }))
          .sort((a, b) => b.total - a.total)[0];

        if (!topUser || topUser.total === 0 || topUser.user.is_admin) continue;

        const jerseyId = JERSEY_ID_MAP[category];
        await supabase
          .from("jerseys")
          .update({
            holder_id: topUser.user.id,
            awarded_at: new Date().toISOString(),
          })
          .eq("id", jerseyId);
      }

      const { data: jData } = await supabase.from("jerseys").select("*");
      if (!jData) return;

      const enriched = jData.map((j) => ({
        ...j,
        holder: users.find((u) => u.id === j.holder_id),
      }));

      setJerseys(enriched);
    };

    fetchAndAssignJerseys();
  }, []);

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚴 Jersey Holders</h1>
      <ul className="space-y-2">
        {jerseys.map((j) => (
          <li key={j.id} className="bg-white p-4 rounded shadow">
            <div className="font-bold">{j.name}</div>
            <div>
              {j.holder?.emoji} {j.holder?.firstname || "Unknown"}
            </div>
            <div className="text-sm text-gray-500">
              Since: {new Date(j.awarded_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
