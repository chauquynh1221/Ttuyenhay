// Service worker tối giản cho Bongmeow — đủ để cài đặt (installable) + cache app-shell.
// Chiến lược: network-first cho HTML, cache-first cho tài nguyên tĩnh.
const CACHE = 'bongmeow-v1'
const SHELL = ['/', '/bongmeow-cat.png', '/manifest.webmanifest']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  // Không cache API/động
  if (url.pathname.startsWith('/api')) return

  if (request.mode === 'navigate') {
    // Network-first cho trang HTML
    e.respondWith(
      fetch(request).catch(() => caches.match(request).then((r) => r || caches.match('/')))
    )
    return
  }

  // Cache-first cho tài nguyên tĩnh (ảnh, css, js)
  e.respondWith(
    caches.match(request).then((cached) =>
      cached ||
      fetch(request).then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {})
        return res
      }).catch(() => cached)
    )
  )
})
