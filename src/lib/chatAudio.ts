import { createClient } from "./supabaseClient";

export async function uploadChatAudio(
  audio: Blob,
  userId: string
): Promise<string> {
  const supabase = createClient();
  const fileExt = "m4a"; // or use "m4a" if from iOS
  const fileName = `${Date.now()}-${userId}.${fileExt}`;
  const filePath = `chat-audio/${fileName}`;

  const { error } = await supabase.storage
    .from("chat-audio")
    .upload(filePath, audio, {
      cacheControl: "3600",
      upsert: false,
      contentType: audio.type || "audio/mp4",
    });

  if (error) {
    throw new Error("Audio upload failed: " + error.message);
  }

  const { data: publicUrl } = supabase.storage
    .from("chat-audio")
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}
