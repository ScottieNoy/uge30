"use client";
import { useState, useEffect } from "react";
import {
  fetchChatMessages,
  fetchMessageWithUserData,
  insertChatMessage,
  fetchUserData,
} from "@/lib/chatMessage";
import { uploadChatImages } from "@/lib/chatImage";
import { createClient } from "@/lib/supabaseClient";

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

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const fetchedMessages = await fetchChatMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error in loadMessages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = async (payload: any) => {
    console.log("New message received:", payload);

    const messageWithUserData = await fetchMessageWithUserData(payload.new.id);

    if (messageWithUserData) {
      console.log("Adding new message to state:", messageWithUserData);
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === messageWithUserData.id);
        if (exists) {
          console.log("Message already exists, skipping");
          return prev;
        }
        console.log("Adding new message to list");
        return [...prev, messageWithUserData];
      });
    }
  };

  useEffect(() => {
    loadMessages();

    console.log("Setting up realtime subscription...");
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        handleNewMessage
      )
      .subscribe();

    return () => {
      console.log("Cleaning up chat subscription");
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async (
    content: string,
    userId: string,
    images?: File[]
  ) => {
    console.log(
      "Sending message:",
      content,
      "from user:",
      userId,
      "with images:",
      images?.length || 0
    );

    // Get current user data for optimistic update
    const userData = await fetchUserData(userId);
    console.log("User data for optimistic update:", userData);

    let imageUrls: string[] = [];

    // Handle image uploads first
    if (images && images.length > 0) {
      try {
        console.log("Starting image upload process...");
        imageUrls = await uploadChatImages(images, userId);
        console.log("Successfully uploaded images:", imageUrls);
      } catch (error) {
        console.error("Image upload failed:", error);
        // Re-throw the error with more context
        throw new Error(
          error instanceof Error ? error.message : "Failed to upload images"
        );
      }
    }

    // Create optimistic message
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content,
      created_at: new Date().toISOString(),
      user_id: userId,
      images: imageUrls.length > 0 ? imageUrls : null,
      users: userData
        ? {
            displayname: userData.displayname ?? "",
            firstname: userData.firstname ?? "",
            lastname: userData.lastname ?? "",
            avatar_url: userData.avatar_url ?? "",
            emoji: userData.emoji ?? "",
          }
        : {
            displayname: "You",
            firstname: "",
            lastname: "",
            avatar_url: "",
            emoji: "👤",
          },
    };

    console.log("Adding optimistic message:", optimisticMessage);
    setMessages((prev) => {
      console.log("Previous messages:", prev.length);
      const newMessages = [...prev, optimisticMessage];
      console.log("New messages count:", newMessages.length);
      return newMessages;
    });

    try {
      const savedMessage = await insertChatMessage(content, userId, imageUrls);

      // Replace optimistic message with real message
      if (savedMessage) {
        setMessages((prev) => {
          const updated = prev.map((msg) =>
            msg.id === optimisticMessage.id
              ? {
                  ...savedMessage,
                  content: savedMessage.content ?? "",
                  created_at:
                    savedMessage.created_at ?? new Date().toISOString(),
                  user_id: savedMessage.user_id ?? "",
                  users: {
                    displayname: savedMessage.users?.displayname ?? "",
                    firstname: savedMessage.users?.firstname ?? "",
                    lastname: savedMessage.users?.lastname ?? "",
                    avatar_url: savedMessage.users?.avatar_url ?? "",
                    emoji: savedMessage.users?.emoji ?? "",
                  },
                  images: savedMessage.images ?? null,
                }
              : msg
          );
          console.log("Replaced optimistic message with real message");
          return updated;
        });
      }
    } catch (error) {
      console.error("Error saving message to database:", error);
      // Remove optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      throw new Error("Failed to save message to database");
    }
  };

  console.log("useChatMessages: Current messages count:", messages.length);

  return {
    messages,
    isLoading,
    sendMessage,
  };
};