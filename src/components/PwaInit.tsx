'use client'

import { useEffect } from 'react'

export default function PwaInit() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration)

          // Optional: handle updates
          registration.onupdatefound = () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.onstatechange = () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('🔄 New content available, will be used on next reload.')
                  } else {
                    console.log('🎉 Content cached for offline use.')
                  }
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error)
        })
    }
  }, [])

  return null
}
