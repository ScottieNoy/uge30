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
