"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabaseClient";

interface PostCreationProps {
  onClose: () => void;
}

const PostCreation = ({ onClose }: PostCreationProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast("⚠️ Skriv noget inden du poster.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Du skal være logget ind for at poste.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("posts").insert({
      content,
      user_id: user.id,
      pinned: false,
    });

    if (insertError) {
      toast.error("Kunne ikke oprette opslag.");
      setLoading(false);
      return;
    }

    // Send push notification to all subscribers
    const res = await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        broadcast: true,
        title: "📬 Nyt opslag",
        body: content.length > 100 ? content.slice(0, 100) + "…" : content,
        url: "/", // Or change to e.g. "/feed"
      }),
    });

    if (!res.ok) {
      toast.error("Opslaget blev oprettet, men notifikation fejlede.");
    } else {
      toast.success("📬 Opslag oprettet og notifikation sendt!");
    }

    setContent("");
    setLoading(false);
    onClose();
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Opret opslag</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Hvad sker der på festivalen?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-white/60"
            disabled={loading}
          />

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button type="button" variant="ghost" size="sm" className="text-white" disabled />
              <Button type="button" variant="ghost" size="sm" className="text-white" disabled />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Poster..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostCreation;
