'use client'

import { useEffect, useState } from 'react'

export default function EnableNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission)
    }
  }, [])

  const handleEnable = async () => {
    if (!('serviceWorker' in navigator)) {
      alert("Service workers are not supported in this browser.")
      return
    }

    const registration = await navigator.serviceWorker.ready

    const permissionResult = await Notification.requestPermission()
    if (permissionResult !== 'granted') {
      alert("Notification permission not granted.")
      return
    }

    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        ? urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
        : undefined,
    }

    const subscription = await registration.pushManager.subscribe(subscribeOptions)

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })

    if (res.ok) {
      alert('🔔 Notifikationer aktiveret!')
      setPermission('granted')
    } else {
      alert('❌ Kunne ikke aktivere notifikationer.')
    }
  }

  return (
    <div>
      {permission === 'granted' ? (
        <p className="text-green-600 font-semibold">Notifikationer er aktiveret ✅</p>
      ) : (
        <button
          onClick={handleEnable}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Aktiver Notifikationer
        </button>
      )}
    </div>
  )
}

// Utility: Convert base64 public key to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}
