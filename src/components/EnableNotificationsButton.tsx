'use client'

import { useEffect, useState } from 'react'
import { subscribeToPush } from '@/lib/subscribeToPush'
import { toast } from 'sonner'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EnableNotificationsButton() {
  const [loading, setLoading] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (
      typeof Notification !== 'undefined' &&
      Notification.permission !== 'granted'
    ) {
      setShouldShow(true)
    }
  }, [])

  const handleEnable = async () => {
    setLoading(true)
    const success = await subscribeToPush()
    setLoading(false)

    if (success) {
      toast.success('🔔 Notifikationer aktiveret!')
      setShouldShow(false)
    } else {
      toast.error('Kunne ikke aktivere notifikationer.')
    }
  }

  if (!shouldShow) return null

  return (
    <Button
      onClick={handleEnable}
      disabled={loading}
      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
    >
      <Bell className="h-4 w-4 mr-2" />
      {loading ? 'Aktiverer...' : 'Aktivér notifikationer'}
    </Button>
  )
}
