'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { QRCodeCanvas } from "qrcode.react"
import { User } from "@/types"

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [points, setPoints] = useState<number>(0)
  const [jersey, setJersey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifStatus, setNotifStatus] = useState(Notification.permission)

  useEffect(() => {
    const loadData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData.session?.user

      if (!sessionUser) {
        alert("You must be logged in to view this page.")
        return
      }

      const userId = sessionUser.id

      // Fetch user info
      const { data: users } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .limit(1)
      const currentUser = users?.[0] || null
      setUser(currentUser)

      // Sum points
      const { data: pointLogs } = await supabase
        .from("points")
        .select("value")
        .eq("user_id", userId)
      const total = pointLogs?.reduce((acc, p) => acc + (p.value || 0), 0) || 0
      setPoints(total)

      // Check jersey
      const { data: jerseys } = await supabase
        .from("jerseys")
        .select("name")
        .eq("holder_id", userId)
      if (jerseys && jerseys.length > 0) {
        const names = jerseys.map(j => j.name).join(", ")
        setJersey(names)
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const handleEnableNotifications = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert("Din browser understøtter ikke notifikationer.")
      return
    }

    const permission = await Notification.requestPermission()
    setNotifStatus(permission)

    if (permission !== 'granted') {
      alert("Du skal give tilladelse for at få notifikationer.")
      return
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
    })

    const { data: sessionData } = await supabase.auth.getSession()
    const sessionUser = sessionData.session?.user

    if (!sessionUser) {
      alert("Session ikke fundet.")
      return
    }

    const { error } = await supabase.from("notifications").upsert({
      user_id: sessionUser.id,
      subscription: subscription.toJSON(),
    })

    if (error) {
      alert("Kunne ikke gemme subscription: " + error.message)
    } else {
      alert("🔔 Notifikationer aktiveret!")
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : ""

  if (loading) return <p className="p-4">Loading your profile...</p>
  if (!user) return <p className="p-4 text-red-600">User not found.</p>

  return (
    <main className="p-4 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">👤 My Festival Stats</h1>

      <div className="bg-white shadow rounded p-4">
        <p className="text-lg">{user.emoji} <strong>{user.firstname}</strong></p>
        <p>Total Points: <strong>{points}</strong></p>
        <p>Jersey: {jersey ? <strong>{jersey}</strong> : "None"}</p>
      </div>

      <div className="bg-white shadow rounded p-4 text-center">
        <h2 className="text-xl font-bold mb-2">🔗 Din personlige QR-kode</h2>
        <p className="text-gray-600 mb-3">Lad en ven scanne den for at logge en drik for dig</p>
        <QRCodeCanvas value={`${origin}/drink/u/${user.id}`} size={200} />
        <p className="mt-2 font-semibold">{user.emoji} {user.firstname}</p>
      </div>

      <div className="text-center">
        <button
          onClick={handleEnableNotifications}
          disabled={notifStatus === 'granted'}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          {notifStatus === 'granted' ? '✅ Notifikationer er slået til' : '🔔 Aktiver Notifikationer'}
        </button>
      </div>
    </main>
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
