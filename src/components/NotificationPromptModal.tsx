'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Bell, X } from 'lucide-react'
import { toast } from 'sonner'
import { subscribeToPush } from '@/lib/subscribeToPush'

interface NotificationPromptModalProps {
  isOpen: boolean
  onClose: () => void
}

const NotificationPromptModal = ({
  isOpen,
  onClose
}: NotificationPromptModalProps) => {
  const [loading, setLoading] = useState(false)

  const handleAllow = async () => {
  setLoading(true)
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const success = await subscribeToPush()
      if (success) {
        toast.success('🔔 Notifikationer aktiveret!')
      } else {
        toast.error('Kunne ikke aktivere notifikationer.')
      }
    } else {
      toast.error('Du afviste notifikationer.')
    }
  } catch (error) {
    toast.error('Der opstod en fejl ved anmodning om tilladelse.')
  } finally {
    setLoading(false)
    onClose()
  }
}


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full my-2 p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
        <DialogTitle className="text-lg text-white flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Aktivér Notifikationer
        </DialogTitle>

        <p className="text-white text-sm mt-2">
          Vi bruger notifikationer til at give dig besked, når du får nye
          point, badges og opdateringer under UGE30.
        </p>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={onClose}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            Senere
          </Button>
          <Button
            onClick={handleAllow}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            {loading ? 'Aktiverer...' : 'Tillad Notifikationer'}
          </Button>
        </div>

        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute right-2 -top-14 z-50 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Luk</span>
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default NotificationPromptModal
