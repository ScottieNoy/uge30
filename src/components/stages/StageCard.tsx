"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabaseClient";

interface StageCardProps {
  stage: {
    id: string;
    created_at: string | null;
    name: string;
    date: string | null;
  };
}

const StageCard: React.FC<StageCardProps> = ({ stage }) => {
  const supabase = createClient();
  const [nextEvent, setNextEvent] = useState<null | {
    title: string;
    time: string;
  }>(null);

  useEffect(() => {
    const loadNextEvent = async () => {
      const { data } = await supabase
        .from("events")
        .select("title, time")
        .eq("stage_id", stage.id)
        .gt("time", new Date().toISOString())
        .order("time", { ascending: true })
        .limit(1);

      if (data?.[0] && data[0].title && data[0].time) {
        setNextEvent({
          title: data[0].title,
          time: data[0].time,
        });
      }
    };

    loadNextEvent();
  }, [stage.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("da-DK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link href={`/stages/${stage.id}`} className="block group">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        <Card className="relative bg-white/80 backdrop-blur-md border border-gray-100 shadow-md rounded-2xl overflow-hidden">
          {/* Hover gradient overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-indigo-100/60 pointer-events-none z-0"
          />

          <CardHeader className="relative z-10 px-4 pt-5 pb-2 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">
              <div className="flex items-start gap-2">
                <h3 className="self-center text-gray-900 font-semibold group-hover:text-blue-700 transition-colors duration-300 leading-tight break-words">
                  {stage.name}
                </h3>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 px-4 pt-2 pb-5 sm:px-6">
            {nextEvent ? (
              <div className="items-center gap-2 text-xs text-gray-500 bg-gray-100/80 rounded-md px-3 py-2 inline-flex backdrop-blur-sm border border-gray-200">
                <span className="text-blue-500">📅</span>
                <div className="flex flex-col">
                  <span className="font-medium">{nextEvent.title}</span>
                  <span className="text-xs">{formatDate(nextEvent.time)}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic mb-2">
                Ingen kommende aktiviteter
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default StageCard;
