"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Image, X, AlertCircle, Mic } from "lucide-react";
import { toast } from "sonner";
import { sendNotification } from "@/lib/sendNotification";
import { useAuth } from "@/hooks/useAuth";
import { compressImage } from "@/lib/compressImage";
import VoiceRecorder from "./VoiceRecorder";

interface ChatInputProps {
  onSendMessage: (
    message: string,
    images?: File[],
    audio?: Blob
  ) => Promise<void>;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, profile } = useAuth();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (!message.trim() && imageFiles.length === 0 && !audioBlob) ||
      isSending ||
      disabled
    )
      return;

    setIsSending(true);
    setUploadError(null);

    try {
      await onSendMessage(
        message.trim(),
        imageFiles.length > 0 ? imageFiles : undefined,
        audioBlob || undefined
      );

      if (message.trim()) {
        await sendNotification({
          senderId: user?.id,
          broadcast: true,
          title: "Ny chatbesked",
          body: `${
            profile.displayname || "Nogen"
          } har sendt en besked: "${message.trim()}"`,
          url: "/social?tab=chat",
        });
      }

      // ✅ Reset state
      setMessage("");
      setImageFiles([]);
      setImagePreviews([]);
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      setAudioBlob(null);
      setAudioURL(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to send message"
      );
      toast("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      try {
        const compressed = await compressImage(file, 1000);
        newFiles.push(compressed);
        const previewUrl = URL.createObjectURL(compressed);
        newPreviews.push(previewUrl);
      } catch (err) {
        console.error("Compression error", err);
        toast("Kunne ikke komprimere billedet");
      }
    }

    setImageFiles((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [imagePreviews, audioURL]);

  return (
    <div className="p-3 sm:p-4">
      {uploadError && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {imagePreviews.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {imagePreviews.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded border border-white/20"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                <X className="w-2 h-2 sm:w-3 sm:h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🎤 Voice preview */}
      {audioURL && (
        <div className="mb-3 flex items-center gap-2">
          <audio controls src={audioURL} className="w-full" />
          <button
            type="button"
            onClick={() => {
              if (audioURL) URL.revokeObjectURL(audioURL);
              setAudioBlob(null);
              setAudioURL(null);
            }}
            className="text-red-400 hover:text-red-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isSending || disabled}
          className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/60 text-base h-10 sm:h-11"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isSending || disabled || imageFiles.length >= 5}
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
          title={imageFiles.length >= 5 ? "Maximum 5 images" : "Add images"}
        >
          <Image className="h-4 w-4" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* 🎤 Mic button */}
        <VoiceRecorder
          onAudioRecorded={(audioBlob) => {
            onSendMessage("", [], audioBlob);
          }}
        />

        <Button
          type="submit"
          disabled={
            isSending ||
            disabled ||
            (!message.trim() && imageFiles.length === 0 && !audioBlob)
          }
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white h-10 w-10 sm:h-11 sm:w-11 p-0 flex-shrink-0"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
