"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Image, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (message: string, images?: File[]) => Promise<void>;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (!message.trim() && selectedImages.length === 0) ||
      isSending ||
      disabled
    )
      return;

    setIsSending(true);
    setUploadError(null);

    try {
      await onSendMessage(
        message.trim(),
        selectedImages.length > 0 ? selectedImages : undefined
      );
      setMessage("");
      setSelectedImages([]);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("Files selected:", files.length);

    // Filter for image files only
    const imageFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isImage) {
        toast("Only image files are allowed");
      }

      if (!isValidSize) {
        toast(`File ${file.name} exceeds the 5MB size limit`);
      }

      return isImage && isValidSize;
    });

    console.log("Valid image files:", imageFiles.length);

    // Add to existing images (max 5 total)
    setSelectedImages((prev) => {
      const combined = [...prev, ...imageFiles];
      const limited = combined.slice(0, 5);

      if (combined.length > 5) {
        toast("Maximum 5 images allowed. Extra images will be ignored.");
      }

      return limited;
    });

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setUploadError(null);
  };

  return (
    <div className="p-3 sm:p-4">
      {/* Error display */}
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

      {/* Image previews - mobile optimized */}
      {selectedImages.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedImages.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded border border-white/20"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
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

      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* Input field - mobile first */}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isSending || disabled}
          className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/60 text-sm sm:text-base h-10 sm:h-11"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        {/* Image upload button - touch friendly */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={isSending || disabled || selectedImages.length >= 5}
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
          title={selectedImages.length >= 5 ? "Maximum 5 images" : "Add images"}
        >
          <Image className="h-4 w-4" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Send button - touch friendly */}
        <Button
          type="submit"
          disabled={
            isSending ||
            disabled ||
            (!message.trim() && selectedImages.length === 0)
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
