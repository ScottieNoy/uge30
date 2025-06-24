'use client'

import { useEffect } from 'react'

export default function NotificationManager() {
  useEffect(() => {
    const subscribeToPush = async () => {
      // 1. Ensure browser supports Push
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn("Push notifications not supported in this browser.")
        return
      }

      // 2. Ask for permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        console.warn("Notification permission not granted.")
        return
      }

      // 3. Wait for service worker to be ready
      const registration = await navigator.serviceWorker.ready

      // 4. Subscribe using VAPID public key
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      })

      // 5. Save subscription to backend
      await fetch('/api/save-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      })

      console.log('✅ Subscribed to push notifications!')
    }

    subscribeToPush()
  }, [])

  return null
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return new Uint8Array([...raw].map(char => char.charCodeAt(0)))
}
