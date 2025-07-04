import { createClient } from "./supabaseClient";

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  images: string[] | null;
  users: {
    displayname: string;
    firstname: string;
    lastname: string;
    avatar_url: string;
    emoji: string;
  };
}
const supabase = createClient();

export const fetchChatMessages = async (): Promise<ChatMessage[]> => {
  console.log("Fetching messages...");
  const { data, error } = await supabase
    .from("chat_messages")
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      images,
      users:user_id (
        displayname,
        firstname,
        lastname,
        avatar_url,
        emoji
      )
    `
    )
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }

  console.log("Fetched messages:", data);
  return (data || []).map((msg: any) => ({
    id: msg.id ?? "",
    content: msg.content ?? "",
    created_at: msg.created_at ?? "",
    user_id: msg.user_id ?? "",
    images: msg.images ?? null,
    users: {
      displayname: msg.users?.displayname ?? "",
      firstname: msg.users?.firstname ?? "",
      lastname: msg.users?.lastname ?? "",
      avatar_url: msg.users?.avatar_url ?? "",
      emoji: msg.users?.emoji ?? "",
    },
  }));
};

export const fetchMessageWithUserData = async (
  messageId: string
): Promise<ChatMessage | null> => {
  const { data, error } = await supabase
    .from("chat_messages")
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      images,
      users:user_id (
        displayname,
        firstname,
        lastname,
        avatar_url,
        emoji
      )
    `
    )
    .eq("id", messageId)
    .single();

  if (error) {
    console.error("Error fetching message with user data:", error);
    return null;
  }

  if (!data) return null;
  return {
    id: data.id ?? "",
    content: data.content ?? "",
    created_at: data.created_at ?? "",
    user_id: data.user_id ?? "",
    images: data.images ?? null,
    users: {
      displayname: data.users?.displayname ?? "",
      firstname: data.users?.firstname ?? "",
      lastname: data.users?.lastname ?? "",
      avatar_url: data.users?.avatar_url ?? "",
      emoji: data.users?.emoji ?? "",
    },
  };
};

export const insertChatMessage = async (
  content: string,
  userId: string,
  imageUrls: string[]
) => {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      content,
      user_id: userId,
      images: imageUrls.length > 0 ? imageUrls : null,
    })
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      images,
      users:user_id (
        displayname,
        firstname,
        lastname,
        avatar_url,
        emoji
      )
    `
    )
    .single();

  if (error) {
    console.error("Error sending message:", error);
    throw error;
  }

  console.log("Message sent successfully:", data);
  return data;
};

export const fetchUserData = async (userId: string) => {
  const { data } = await supabase
    .from("users")
    .select("displayname, firstname, lastname, avatar_url, emoji")
    .eq("id", userId)
    .single();

  return data;
};
