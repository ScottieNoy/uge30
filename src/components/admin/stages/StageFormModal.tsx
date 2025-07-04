"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabaseClient";

interface Event {
  id: string;
  title: string;
  time: string;
  emoji: string;
  location: string;
  description: string;
  stage_id: string;
}

interface Stage {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

interface StageFormModalProps {
  existingStage?: Stage;
  onClose: () => void;
  onSaved: () => void;
}

export default function StageFormModal({
  existingStage,
  onClose,
  onSaved,
}: StageFormModalProps) {
  const [title, setTitle] = useState(existingStage?.title ?? "");
  const [description, setDescription] = useState(
    existingStage?.description ?? ""
  );
  const [emoji, setEmoji] = useState(existingStage?.emoji ?? "");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    emoji: "",
    location: "",
    description: "",
  });

  const supabase = createClient();

  // Load existing events if editing
  useEffect(() => {
    if (!existingStage) return;
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("stage_id", existingStage.id)
        .order("time");
      if (data)
        setEvents(
          data.map((ev) => ({
            id: ev.id,
            title: ev.title ?? "",
            time: ev.time ?? "",
            emoji: ev.emoji ?? "",
            location: ev.location ?? "",
            description: ev.description ?? "",
            stage_id: ev.stage_id ?? "",
          }))
        );
    };
    fetchEvents();
  }, [existingStage]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Titel er påkrævet");
      return;
    }

    setLoading(true);

    const payload = {
      name: title,
      // Note: The stages table doesn't have description/emoji columns based on the schema
      // If you need these, you'll need to add them to the database first
    };

    try {
      if (existingStage) {
        const { error } = await supabase
          .from("stages")
          .update(payload)
          .eq("id", existingStage.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("stages").insert(payload);

        if (error) throw error;
      }

      toast.success(existingStage ? "Etape opdateret" : "Etape oprettet");
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving stage:", error);
      toast.error("Fejl ved gemning af etape");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!existingStage) return;

    if (!newEvent.title.trim()) {
      toast.error("Event titel er påkrævet");
      return;
    }

    try {
      const { error } = await supabase.from("events").insert({
        title: newEvent.title,
        time: newEvent.time ? localInputToUTC(newEvent.time) : null,
        emoji: newEvent.emoji || null,
        location: newEvent.location || null,
        description: newEvent.description || null,
        stage_id: existingStage.id,
      });

      if (error) throw error;

      setNewEvent({
        title: "",
        time: "",
        emoji: "",
        location: "",
        description: "",
      });

      toast.success("Event oprettet");

      // Refresh events
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("stage_id", existingStage.id)
        .order("time");
      if (data)
        setEvents(
          data.map((ev) => ({
            id: ev.id,
            title: ev.title ?? "",
            time: ev.time ?? "",
            emoji: ev.emoji ?? "",
            location: ev.location ?? "",
            description: ev.description ?? "",
            stage_id: ev.stage_id ?? "",
          }))
        );
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Kunne ikke oprette event");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;

      setEvents(events.filter((e) => e.id !== id));
      toast.success("Event slettet");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Kunne ikke slette event");
    }
  };

  const handleUpdateEvent = async (event: Event) => {
    try {
      const { error } = await supabase
        .from("events")
        .update({
          title: event.title,
          time: event.time ? localInputToUTC(event.time) : null,
          emoji: event.emoji || null,
          location: event.location || null,
          description: event.description || null,
        })
        .eq("id", event.id);

      if (error) throw error;
      toast.success("Event opdateret");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Kunne ikke opdatere event");
    }
  };

  const toLocalInputValue = (utcString: string) => {
    if (!utcString) return "";
    const date = new Date(utcString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISO = new Date(date.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16);
    return localISO;
  };

  const localInputToUTC = (value: string) => {
    const local = new Date(value);
    return new Date(
      local.getTime() - local.getTimezoneOffset() * 60000
    ).toISOString();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 max-h-[90vh] overflow-y-auto rounded-lg p-6 space-y-6">
        <DialogTitle className="text-white text-xl font-semibold">
          {existingStage ? "Rediger Etape" : "Ny Etape"}
        </DialogTitle>

        {/* Stage Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-1">Titel</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="F.eks. Øldag"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Beskrivelse</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kort beskrivelse"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <div>
            <label className="block text-white mb-1">Emoji</label>
            <Input
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🍺"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? "Gemmer..." : "Gem Etape"}
          </Button>
        </div>

        {/* Events Section */}
        {existingStage && (
          <>
            <hr className="border-white/20" />
            <h3 className="text-white font-semibold text-lg">
              Planlagte Aktiviteter
            </h3>

            {/* Existing Events */}
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-md border border-white/20 bg-white/5 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Titel"
                      value={event.title}
                      onChange={(e) =>
                        setEvents((prev) =>
                          prev.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, title: e.target.value }
                              : ev
                          )
                        )
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <Input
                      type="datetime-local"
                      value={event.time ? toLocalInputValue(event.time) : ""}
                      onChange={(e) =>
                        setEvents((prev) =>
                          prev.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, time: e.target.value }
                              : ev
                          )
                        )
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />

                    <Input
                      placeholder="Lokation"
                      value={event.location ?? ""}
                      onChange={(e) =>
                        setEvents((prev) =>
                          prev.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, location: e.target.value }
                              : ev
                          )
                        )
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <Input
                      placeholder="Emoji"
                      value={event.emoji ?? ""}
                      onChange={(e) =>
                        setEvents((prev) =>
                          prev.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, emoji: e.target.value }
                              : ev
                          )
                        )
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>

                  <Textarea
                    placeholder="Beskrivelse"
                    value={event.description ?? ""}
                    onChange={(e) =>
                      setEvents((prev) =>
                        prev.map((ev) =>
                          ev.id === event.id
                            ? { ...ev, description: e.target.value }
                            : ev
                        )
                      )
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />

                  <div className="flex justify-between gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdateEvent(event)}
                      className="flex-1"
                    >
                      Gem ændringer
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex-1"
                    >
                      Slet
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Event */}
            <div className="mt-8 p-4 rounded-md border border-white/20 bg-white/10 space-y-3">
              <h4 className="text-white font-medium text-md">
                ➕ Tilføj ny aktivitet
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Titel"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Input
                  type="datetime-local"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="bg-white/10 border-white/20 text-white"
                />

                <Input
                  placeholder="Lokation"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Input
                  placeholder="Emoji"
                  value={newEvent.emoji}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, emoji: e.target.value }))
                  }
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>

              <Textarea
                placeholder="Beskrivelse"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />

              <Button
                onClick={handleCreateEvent}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                ➕ Opret Event
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
