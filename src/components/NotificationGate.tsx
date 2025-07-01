'use client'

import { useEffect, useState } from 'react'
import NotificationPromptModal from '@/components/NotificationPromptModal'
import { createClient } from '@/lib/supabaseClient'

export default function NotificationGate() {
  const [showModal, setShowModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuthAndPermission = async () => {
      const supabase = createClient()
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (session?.user) {
        setIsLoggedIn(true)

        const permission = Notification?.permission
        const dismissed = localStorage.getItem('notifications-dismissed')

        if (permission === 'default' && !dismissed) {
          const timer = setTimeout(() => setShowModal(true), 2500)
          return () => clearTimeout(timer)
        }
      }
    }

    checkAuthAndPermission()
  }, [])

  const handleClose = () => {
    setShowModal(false)
    localStorage.setItem('notifications-dismissed', 'true')
  }

  if (!isLoggedIn) return null

  return <NotificationPromptModal isOpen={showModal} onClose={handleClose} />
}
