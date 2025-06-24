'use client'

import { useEffect, useState } from "react"

export default function EnableNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission)

  const handleEnable = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert("Push notifications not supported.")
      return
    }

    const permission = await Notification.requestPermission()
    setPermission(permission)

    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      })
      console.log("✅ Subscribed:", subscription.toJSON())

      // TODO: Send `subscription` to your Supabase backend here
    } else {
      console.warn("Notifications permission denied:", permission)
    }
  }

  return (
    <button
      onClick={handleEnable}
      disabled={permission === 'granted'}
      className="px-4 py-2 rounded bg-blue-600 text-white"
    >
      {permission === 'granted' ? "🔔 Notifications enabled" : "Enable Notifications"}
    </button>
  )
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
