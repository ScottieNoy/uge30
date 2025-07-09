// lib/subscribeToPush.ts
export async function subscribeToPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported in this browser.')
    return false
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    console.warn('Notification permission not granted.')
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
    })

    const res = await fetch('/api/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 🔒 Ensures cookies are sent
      body: JSON.stringify(subscription),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error('❌ Failed to save subscription:', error)
      return false
    }

    console.log('✅ Subscribed to push notifications!')
    return true
  } catch (err) {
    console.error('❌ Error during push subscription:', err)
    return false
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return new Uint8Array([...raw].map((char) => char.charCodeAt(0)))
}
