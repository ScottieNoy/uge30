"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Types
interface Stage {
  id: string;
  title: string;
  emoji: string | null;
  description: string | null;
  created_at: string | null;
}

interface Event {
  id: string;
  title: string;
  emoji: string | null;
  description: string | null;
  location: string | null;
  time: string;
}

export default function StageDetailPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [stage, setStage] = useState<Stage | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);

      const { data: stageData, error: stageError } = await supabase
        .from("stages")
        .select("*")
        .eq("id", id)
        .single();

      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("stage_id", id)
        .order("time");

      if (!stageError) setStage(stageData as Stage);
      setEvents((eventData || []) as Event[]);
      setLoading(false);
    };

    load();
  }, [id]);

  if (!id)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 text-center">ID mangler.</p>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 text-center">Indlæser etape...</p>
        </div>
      </div>
    );

  if (!stage)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 text-center">Etapen blev ikke fundet.</p>
        </div>
      </div>
    );

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("da-DK", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleBack = () => {
    router.back();
    // Alternatively, you can use router.push('/stages') to go to the stages list
  };

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Button
            onClick={handleBack}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tilbage til etaper</span>
            <span className="sm:hidden">Tilbage</span>
          </Button>
        </motion.div>
        {/* Stage Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-md rounded-2xl mb-6">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle className="text-2xl sm:text-3xl">
                <div className="flex items-start gap-4">
                  {stage.emoji && (
                    <span className="text-4xl shrink-0">{stage.emoji}</span>
                  )}
                  <h1 className="self-center text-gray-900 font-bold leading-tight break-words">
                    {stage.title}
                  </h1>
                </div>
              </CardTitle>
            </CardHeader>

            {stage.description && (
              <CardContent className="px-6 pb-6 pt-0">
                <p className="text-gray-600 leading-relaxed">
                  {stage.description}
                </p>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Events Section */}
        {events.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Aktiviteter
            </h2>
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-md rounded-2xl overflow-hidden">
                  {/* Hover gradient overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-indigo-100/60 pointer-events-none z-0"
                  />

                  <CardHeader className="relative z-10 px-6 pt-5 pb-2">
                    <CardTitle className="text-lg">
                      <div className="flex items-start gap-3">
                        {event.emoji && (
                          <span className="text-2xl shrink-0">
                            {event.emoji}
                          </span>
                        )}
                        <h3 className="self-center text-gray-900 font-semibold leading-tight break-words">
                          {event.title}
                        </h3>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative z-10 px-6 pb-5 pt-0">
                    <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-100/80 rounded-md px-3 py-2 backdrop-blur-sm border border-gray-200 mb-3">
                      <span className="text-blue-500">📅</span>
                      <span className="font-medium">
                        {formatDateTime(event.time)}
                        {event.location && ` • ${event.location}`}
                      </span>
                    </div>

                    {event.description && (
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {event.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-md rounded-2xl">
              <CardContent className="px-6 py-8 text-center">
                <p className="text-gray-500">
                  Ingen aktiviteter planlagt for denne etape.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
