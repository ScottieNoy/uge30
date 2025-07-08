"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AssignPointsForm() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [jerseys, setJerseys] = useState<any[]>([]);

  const [userId, setUserId] = useState("");
  const [jerseyId, setJerseyId] = useState("");
  const [value, setValue] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase.from("users").select("id, displayname");
      const { data: jerseysData } = await supabase.from("jerseys").select("id, name");
      setUsers(usersData || []);
      setJerseys(jerseysData || []);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: sessionData } = await supabase.auth.getSession();
    const adminId = sessionData.session?.user?.id;

    if (!adminId || !userId || !jerseyId || !value) {
      toast.error("Missing required fields");
      return;
    }

    const { data: point, error: pointError } = await supabase
      .from("points")
      .insert([
        {
          user_id: userId,
          submitted_by: adminId,
          value,
          note,
        },
      ])
      .select()
      .single();

    if (pointError || !point) {
      toast.error("Failed to insert point");
      return;
    }

    const { error: mappingError } = await supabase
      .from("point_jerseys")
      .insert([
        {
          point_id: point.id,
          jersey_id: jerseyId,
        },
      ]);

    if (mappingError) {
      toast.error("Failed to map point to jersey");
      return;
    }

    toast.success("Point successfully assigned!");
    setUserId("");
    setJerseyId("");
    setValue(1);
    setNote("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold">Assign Points</h2>

      <div>
        <label>User</label>
        <select value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full border p-2 rounded">
          <option value="">Select a user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.displayname}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Jersey</label>
        <select value={jerseyId} onChange={(e) => setJerseyId(e.target.value)} className="w-full border p-2 rounded">
          <option value="">Select a jersey</option>
          {jerseys.map((j) => (
            <option key={j.id} value={j.id}>
              {j.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Points</label>
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          min={1}
        />
      </div>

      <div>
        <label>Note (optional)</label>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <Button type="submit">Assign</Button>
    </form>
  );
}
