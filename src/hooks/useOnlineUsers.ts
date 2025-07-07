"use client";
import { createClient } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";

interface OnlineUser {
  user_id: string;
  online_at: string;
  user: {
    displayname: string;
    firstname: string;
    lastname: string;
    avatar_url: string;
    emoji: string;
  };
}

export const useOnlineUsers = (userId: string | undefined) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const supabase = createClient();
  useEffect(() => {
    if (!userId) return;

    const roomOne = supabase.channel("online-users");

    roomOne
      .on("presence", { event: "sync" }, () => {
        const newState = roomOne.presenceState();
        // Extract the actual tracked data from the presence state
        const users: OnlineUser[] = [];
        Object.values(newState).forEach((presenceArray: any) => {
          presenceArray.forEach((presence: any) => {
            // The presence object should contain our tracked OnlineUser data
            if (presence.user_id && presence.user) {
              users.push(presence as OnlineUser);
            }
          });
        });
        setOnlineUsers(users);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("User joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("User left:", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;

        // Get user data for presence
        const { data: userData } = await supabase
          .from("users")
          .select("displayname, firstname, lastname, avatar_url, emoji")
          .eq("id", userId)
          .single();

        const userStatus: OnlineUser = {
          user_id: userId,
          online_at: new Date().toISOString(),
          user: userData
            ? {
                displayname: userData.displayname ?? "Anonymous",
                firstname: userData.firstname ?? "",
                lastname: userData.lastname ?? "",
                avatar_url: userData.avatar_url ?? "",
                emoji: userData.emoji ?? "👤",
              }
            : {
                displayname: "Anonymous",
                firstname: "",
                lastname: "",
                avatar_url: "",
                emoji: "👤",
              },
        };

        await roomOne.track(userStatus);
      });

    return () => {
      supabase.removeChannel(roomOne);
    };
  }, [userId]);

  return { onlineUsers };
};