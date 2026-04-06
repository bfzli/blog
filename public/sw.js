const fonts = [
    '/fonts/dm-sans/DMSans-Regular.woff2',
    '/fonts/dm-sans/DMSans-Medium.woff2',
    '/fonts/dm-sans/DMSans-SemiBold.woff2',
    '/fonts/dm-sans/DMSans-Bold.woff2',
    '/fonts/dm-sans/DMSans-ExtraBold.woff2'
]

self.addEventListener('install', async (event) => {
    event.waitUntil(caches.open('fonts-v2').then((cache) => cache.addAll(fonts)))
})

self.addEventListener('activate', async (event) => {
    event.waitUntil(caches.delete('fonts'))
})

self.addEventListener('fetch', async (event) => {
    if (event.request.url.includes('/fonts/')) {
        event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)))
    }
})
