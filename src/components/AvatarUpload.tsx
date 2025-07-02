import { useRef } from "react";
import { createClient } from "@/lib/supabaseClient";
import { toast } from "sonner";

type AvatarUploadProps = {
  onUpload: (publicUrl: string) => void;
};

export default function AvatarUpload({ onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const supabase = createClient();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Invalid File Type");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("File too large. Maximum size is 5MB.");
      return;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      toast("You must be logged in to upload an avatar.");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast("Error uploading file: " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      toast("Error retrieving public URL for the uploaded file.");
      return;
    }

    onUpload(urlData.publicUrl);

    toast("Avatar uploaded successfully!");

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mt-4 flex justify-center">
  <label
    htmlFor="avatar-upload"
    className="bg-cyan-500 text-white py-2 px-4 rounded-md shadow-lg cursor-pointer hover:bg-cyan-600 transition-colors duration-200"
  >
    Upload Avatar
  </label>
  <input
    id="avatar-upload"
    ref={inputRef}
    type="file"
    accept="image/*"
    onChange={handleFileSelect}
    className="hidden"
  />
</div>

  );
}
