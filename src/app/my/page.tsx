"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { QRCodeCanvas } from "qrcode.react";
import { User } from "@/types";
import EnableNotifications from "@/components/EnableNotifications";

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState(0);
  const [jersey, setJersey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          setError("Du skal være logget ind for at se denne side.");
          return;
        }

        const userId = session.user.id;

        // 1. Get user info
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (userError || !userData) {
          setError("Brugerdata kunne ikke hentes.");
          return;
        }

        setUser(userData);

        // 2. Get total points
        const { data: pointLogs, error: pointError } = await supabase
          .from("points")
          .select("value")
          .eq("user_id", userId);

        if (!pointError && pointLogs) {
          const total = pointLogs.reduce((sum, p) => sum + (p.value || 0), 0);
          setPoints(total);
        }
      } catch (e) {
        setError("Der opstod en fejl ved indlæsning af din profil.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [supabase]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (loading) {
    return <p className="p-4">⏳ Indlæser din profil...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  if (!user) {
    return <p className="p-4 text-red-600">Bruger ikke fundet.</p>;
  }

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">👤 My Festival Stats</h1>

      <div className="bg-white shadow rounded p-4 mb-6">
        <p className="text-lg">
          {user.emoji} <strong>{user.firstname}</strong>
        </p>
        <p>
          Total Points: <strong>{points}</strong>
        </p>
        <p>Jersey: {jersey ? <strong>{jersey}</strong> : "None"}</p>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">🔗 Din personlige QR-kode</h2>
        <p className="text-gray-600 mb-3">
          Lad en ven scanne den for at logge en drik for dig
        </p>

        <div className="inline-block bg-white p-4 rounded shadow">
          <QRCodeCanvas value={`${origin}/drink/u/${user.id}`} size={200} />
          <p className="mt-2 font-semibold">
            {user.emoji} {user.firstname}
          </p>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold mb-2">🔔 Notifikationer</h2>
          <EnableNotifications />
        </div>
      </div>
    </main>
  );
}
