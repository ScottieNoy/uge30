'use client'

import { useEffect, useState } from 'react'
import NotificationPromptModal from '@/components/NotificationPromptModal'

export default function NotificationGate() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Don't show if already granted or denied
    if (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'default'
    ) {
      const dismissed = localStorage.getItem('notifications-dismissed')
      if (!dismissed) {
        const timer = setTimeout(() => setShowModal(true), 2500)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleClose = () => {
    setShowModal(false)
    localStorage.setItem('notifications-dismissed', 'true')
  }

  return <NotificationPromptModal isOpen={showModal} onClose={handleClose} />
}
