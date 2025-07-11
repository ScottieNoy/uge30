// hooks/useParticipants.ts
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { User } from "@/types";

export function useParticipants() {
  const supabase = createClient();
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, displayname, avatar_url")
        .order("displayname", { ascending: true });

      if (!error && data) {
        const transformedData = data.map((item) => ({
          id: item.id,
          displayname: item.displayname,
          avatar_url: item.avatar_url,
          created_at: null,
          emoji: null,
          firstname: null,
          is_admin: null,
          lastname: null,
          profile_complete: false,
          role: null,
          updated_at: null,
        }));
        setParticipants(transformedData);
      }
      setLoading(false);
    };

    load();
  }, []);

  return { participants, loading };
}

