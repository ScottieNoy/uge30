export async function sendNotification({
  userId = undefined, // Optional user ID to send notification to
  title,
  body,
  url,
  broadcast = false,
}: {
  userId?: string
  title: string
  body: string
  url?: string
  broadcast?: boolean
}) {
  try {
    const res = await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        title,
        body,
        url,
        broadcast, // If true, send to all users; otherwise, send to specific user
      }),
    })

    if (!res.ok) {
      console.error('Failed to send notification')
    }
  } catch (err) {
    console.error('Error sending notification:', err)
  }
}
