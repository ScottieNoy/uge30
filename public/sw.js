self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service worker activated')
})

self.addEventListener('fetch', (event) => {
  // Default fetch behavior
  return
})

self.addEventListener('push', function (event) {
  const data = event.data?.json() || {}
  const title = data.title || 'UGE 30'
  const options = {
    body: data.body || '',
    icon: '/Uge30Blaa.png',
  }
  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})
