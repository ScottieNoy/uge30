"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import AdminStageItem from "@/components/admin/stages/AdminStageItem";
import StageFormModal from "@/components/admin/stages/StageFormModal";
import { Button } from "@/components/ui/button";

export default function AdminStageList() {
  const supabase = createClient();
  type Stage = {
    id: string;
    name?: string | null;
    date?: string | null;
    created_at?: string | null;
    position?: number;
  };
  const [stages, setStages] = useState<Stage[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadStages = async () => {
    const { data } = await supabase
      .from("stages")
      .select("*")
      .order("position");
    if (data) setStages(data);
  };

  useEffect(() => {
    loadStages();
  }, []);

  return (
    <div>
      <div className="mb-4">
        <Button
          onClick={() => setModalOpen(true)}
          variant={"default"}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          ➕ Opret ny etape
        </Button>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <AdminStageItem
            key={stage.id}
            stage={stage}
            index={index}
            onUpdated={loadStages}
          />
        ))}
      </div>

      {modalOpen && (
        <StageFormModal
          onClose={() => setModalOpen(false)}
          onSaved={loadStages}
        />
      )}
    </div>
  );
}
