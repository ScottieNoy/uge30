"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import Link from "next/link";

interface Event {
  title: string;
  time: string; // ISO 8601 string
  emoji?: string;
  location?: string;
  stage_id?: string; // Assuming stage_id is a string
}

const FestivalCountdown = () => {
  const supabase = createClient();
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchNextEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("time", { ascending: true });

      if (error) {
        console.error("Failed to fetch events:", error.message);
        return;
      }

      const now = new Date();
      const upcoming = data?.find(
        (event) => event.time && new Date(event.time) > now
      );
      if (upcoming) {
        setNextEvent({
          title: upcoming.title? upcoming.title : "Ingen titel",
          time: upcoming.time? upcoming.time : new Date().toISOString(),
          emoji: upcoming.emoji ?? undefined,
          location: upcoming.location ?? undefined,
          stage_id: upcoming.stage_id ?? undefined, // Ensure stage_id is included
        });
        updateCountdown(new Date(upcoming.time ?? new Date().toISOString()));
      }
    };

    const updateCountdown = (targetDate: Date) => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    fetchNextEvent();

    const timer = setInterval(() => {
      if (nextEvent) {
        updateCountdown(new Date(nextEvent.time));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  return nextEvent && nextEvent.stage_id ? (
    <Card className="bg-white/10 text-center col-span-2 p-4 cursor-pointer">
      <Link href={`/stages/${nextEvent.stage_id}`}>
        <CardContent className="p-0 space-y-2 text-white">
          <div className="uppercase text-xs font-semibold tracking-wide text-cyan-400 mb-2">
            Næste aktivitet
          </div>
          <div className="text-xl font-bold">
            {nextEvent.emoji} {nextEvent.title}
          </div>

          <div className="text-sm text-cyan-200 flex items-center justify-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {format(new Date(nextEvent.time), "EEEE 'kl.' HH:mm", {
              locale: da,
            })}
          </div>

          {nextEvent.location && (
            <div className="text-sm text-white/70 flex items-center justify-center gap-1">
              <MapPin className="h-4 w-4 text-cyan-400" />
              {nextEvent.location}
            </div>
          )}

          <div className="flex justify-center space-x-4 font-mono text-sm pt-1">
            <div className="flex items-center space-x-2">
              <TimeBlock label="dage" value={timeLeft.days} />
              <TimeBlock label="timer" value={timeLeft.hours} />
              <TimeBlock label="min" value={timeLeft.minutes} />
              <TimeBlock label="sek" value={timeLeft.seconds} />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  ) : (
    <Card className="bg-white/10 text-center col-span-2 p-4">
      <CardContent className="p-0 space-y-2 text-white">
        <div className="text-white/80 text-sm">Ingen kommende events</div>
      </CardContent>
    </Card>
  );
};

type TimeBlockProps = {
  label: string;
  value: number;
};

const TimeBlock: React.FC<TimeBlockProps> = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-lg font-bold">
      {value.toString().padStart(2, "0")}
    </span>
    <span className="text-xs text-cyan-400">{label}</span>
  </div>
);

export default FestivalCountdown;
