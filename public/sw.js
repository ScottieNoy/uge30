// sw.js

// Install event: activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installed')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated')
})

// Optional fetch event (can be removed if not caching)
self.addEventListener('fetch', (event) => {
  // No custom fetch logic for now
})

// Push event: display the notification
self.addEventListener('push', function (event) {
  console.log('[SW] Push received:', event)

  const data = event.data?.json() || {}

  const title = data.title || 'UGE30'
  const options = {
    body: data.body || '',
    icon: '/Uge30Blaa.png',
    badge: '/icons/badge-72x72.png', // Optional: add a smaller monochrome badge icon
    data: {
      url: data.url || '/' // Used when clicking the notification
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Handle clicks on notifications
self.addEventListener('notificationclick', function (event) {
  console.log('[SW] Notification click received')
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data?.url && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data?.url || '/')
      }
    })
  )
})

// Optional: allow postMessage for skipWaiting update strategy
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING')
    self.skipWaiting()
  }
})
