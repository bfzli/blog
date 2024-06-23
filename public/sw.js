const fonts = [
    '/fonts/space-grostek-bold.woff2',
    '/fonts/space-grostek-light.woff2',
    '/fonts/space-grostek-regular.woff2',
    '/fonts/space-grostek-medium.woff2',
    '/fonts/space-grostek-semi-bold.woff2',
]

self.addEventListener('install', async (event) => {
    event.waitUntil(caches.open('fonts').then((cache) => cache.addAll(fonts)))
})

self.addEventListener('fetch', async (event) => {
    if (event.request.url.includes('/fonts/')) {
        event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)))
    }
})