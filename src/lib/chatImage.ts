import { createClient } from "./supabaseClient";

export const uploadChatImages = async (
  files: File[],
  userId: string
): Promise<string[]> => {
  const supabase = createClient();
  console.log("Starting image upload for", files.length, "files");

  const uploadPromises = files.map(async (file, index) => {
    console.log(
      `Uploading file ${index + 1}:`,
      file.name,
      file.type,
      file.size
    );

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error(`File ${file.name} is not an image`);
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File ${file.name} is too large (max 5MB)`);
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${userId}/${Date.now()}-${index}.${fileExt}`;

    console.log("Uploading to path:", fileName);

    const { data, error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
    }

    console.log("Upload successful:", data);

    const { data: urlData } = supabase.storage
      .from("chat-images")
      .getPublicUrl(fileName);

    console.log("Generated public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  });

  try {
    const results = await Promise.all(uploadPromises);
    console.log("All uploads completed:", results);
    return results;
  } catch (error) {
    console.error("Upload batch failed:", error);
    throw error;
  }
};
