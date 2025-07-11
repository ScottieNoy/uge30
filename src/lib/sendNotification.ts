export async function sendNotification({
  userId = undefined,
  title,
  body,
  url,
  broadcast = false,
  senderId = undefined, // NEW
}: {
  userId?: string;
  title: string;
  body: string;
  url?: string;
  broadcast?: boolean;
  senderId?: string; // NEW
}) {
  try {
    const res = await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        title,
        body,
        url,
        broadcast,
        sender_id: senderId, // NEW
      }),
    });

    if (!res.ok) {
      console.error("Failed to send notification");
    }
  } catch (err) {
    console.error("Error sending notification:", err);
  }
}
