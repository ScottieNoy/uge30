"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Image, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { sendNotification } from "@/lib/sendNotification";

interface PostCreationProps {
  onClose: () => void;
  onPostCreated?: () => void;
}

const PostCreation = ({ onClose, onPostCreated }: PostCreationProps) => {
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const supabase = createClient();
  const { profile } = useAuth();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        setImageFiles((prev) => [...prev, file]);
        const previewUrl = URL.createObjectURL(file);
        setImagePreviews((prev) => [...prev, previewUrl]);
      }
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationShare = () => {
    if (!navigator.geolocation) {
      toast("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsLoadingLocation(false);
        toast("Location shared successfully!");
      },
      () => {
        setIsLoadingLocation(false);
        toast("Failed to get location. Please allow location access.");
      }
    );
  };

  const uploadImages = async () => {
    const urls: string[] = [];

    for (const file of imageFiles) {
      const filePath = `posts/${profile!.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("post-images")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading image:", error);
        toast("Failed to upload image.");
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);
      if (publicUrl?.publicUrl) {
        urls.push(publicUrl.publicUrl);
      }
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && imageFiles.length === 0) {
      toast("Please add some content or images to your post.");
      return;
    }

    if (!profile) {
      toast("Please log in to create a post.");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedImageUrls = await uploadImages();

      const { data, error } = await supabase
        .from("posts")
        .insert({
          content: content.trim(),
          user_id: profile.id,
          images: uploadedImageUrls,
          location,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error("Error creating post:", error);
        toast("Failed to create post.");
        return;
      }

      const postId = data.id;

      // Send notification to all users with direct link to the post
      await sendNotification({
        senderId: profile.id, // NEW
        broadcast: true,
        title: "New Post Created",
        body: `${
          profile.displayname || "Someone"
        } just created a new post!`,
        url: `/social?tab=feed&post=${postId}`,
      });

      toast("Post created successfully!");

      setContent("");
      setImageFiles([]);
      setImagePreviews([]);
      setLocation("");
      onClose();
      onPostCreated?.();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Create Post</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10"
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's happening at the festival?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-white/60"
          />

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {imagePreviews.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {location && (
            <div className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
              <MapPin className="h-4 w-4 text-white/60" />
              <span className="text-white/80 text-sm">
                Location: {location}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setLocation("")}
                className="ml-auto h-6 w-6 p-0 text-white/60 hover:text-white"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="text-white hover:bg-white/10"
                disabled={isSubmitting}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLocationShare}
                className="text-white hover:bg-white/10"
                disabled={isSubmitting || isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostCreation;
