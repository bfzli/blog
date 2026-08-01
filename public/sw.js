const FONT_CACHE = 'fonts-v3'
const ASSET_CACHE = 'assets-v1'
const KEEP = [FONT_CACHE, ASSET_CACHE]

const fonts = [
    '/fonts/dm-sans/DMSans-Regular.woff2',
    '/fonts/dm-sans/DMSans-Medium.woff2',
    '/fonts/dm-sans/DMSans-SemiBold.woff2',
    '/fonts/dm-sans/DMSans-Bold.woff2',
    '/fonts/dm-sans/DMSans-ExtraBold.woff2'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(FONT_CACHE)
            .then((cache) => cache.addAll(fonts))
            .then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => !KEEP.includes(key))
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    )
})

const cacheFirst = (request, name) =>
    caches.match(request).then(
        (hit) =>
            hit ||
            fetch(request).then((response) => {
                if (response.ok) {
                    const copy = response.clone()
                    caches.open(name).then((cache) => cache.put(request, copy))
                }

                return response
            })
    )

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return

    const url = new URL(event.request.url)
    if (url.origin !== self.location.origin) return

    if (url.pathname.startsWith('/fonts/')) {
        event.respondWith(cacheFirst(event.request, FONT_CACHE))
        return
    }

    if (url.pathname.startsWith('/_astro/')) {
        event.respondWith(cacheFirst(event.request, ASSET_CACHE))
    }
})
