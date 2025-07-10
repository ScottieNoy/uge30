// hooks/useJerseys.ts
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { JerseyRow } from "@/types";

export const useJerseys = () => {
  const [jerseys, setJerseys] = useState<JerseyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJerseys = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("jerseys").select("*");
      if (!error && data) {
        setJerseys(data);
      }
      setLoading(false);
    };
    fetchJerseys();
  }, []);

  return { jerseys, loading };
};
