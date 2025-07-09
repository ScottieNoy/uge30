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
  const pointId = crypto.randomUUID(); // Optional, or let the DB auto-generate

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase
        .from("users")
        .select("id, displayname");
      const { data: jerseysData } = await supabase
        .from("jerseys")
        .select("id, name");
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

    const { error: transactionError } = await supabase.rpc(
      "perform_point_and_jersey_insert",
      {
        p_point_id: pointId,
        p_user_id: userId,
        p_submitted_by: adminId,
        p_value: value,
        p_note: note,
        p_stage_id: "c06e6ee6-57b7-44b3-9d4a-5c90be333be2",
        p_jersey_id: jerseyId,
      }
    );

    if (transactionError) {
      toast.error("Failed to insert point and jersey");
    } else {
      toast.success("Point + jersey linked ✅");
    }

    setUserId("");
    setJerseyId("");
    setValue(1);
    setNote("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md p-4 border rounded-lg bg-white shadow"
    >
      <h2 className="text-xl font-bold">Assign Points</h2>

      <div>
        <label>User</label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full border p-2 rounded"
        >
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
        <select
          value={jerseyId}
          onChange={(e) => setJerseyId(e.target.value)}
          className="w-full border p-2 rounded"
        >
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
