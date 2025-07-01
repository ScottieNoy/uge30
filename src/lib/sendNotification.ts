export async function sendNotificationToUser({
  userId,
  title,
  body,
  url,
}: {
  userId: string
  title: string
  body: string
  url?: string
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
      }),
    })

    if (!res.ok) {
      console.error('Failed to send notification')
    }
  } catch (err) {
    console.error('Error sending notification:', err)
  }
}
