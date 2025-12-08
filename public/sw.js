const fonts = [
    '/fonts/dm-sans/DMSans-Thin.ttf',
    '/fonts/dm-sans/DMSans-ThinItalic.ttf',
    '/fonts/dm-sans/DMSans-ExtraLight.ttf',
    '/fonts/dm-sans/DMSans-ExtraLightItalic.ttf',
    '/fonts/dm-sans/DMSans-Light.ttf',
    '/fonts/dm-sans/DMSans-LightItalic.ttf',
    '/fonts/dm-sans/DMSans-Regular.ttf',
    '/fonts/dm-sans/DMSans-Italic.ttf',
    '/fonts/dm-sans/DMSans-Medium.ttf',
    '/fonts/dm-sans/DMSans-MediumItalic.ttf',
    '/fonts/dm-sans/DMSans-SemiBold.ttf',
    '/fonts/dm-sans/DMSans-SemiBoldItalic.ttf',
    '/fonts/dm-sans/DMSans-Bold.ttf',
    '/fonts/dm-sans/DMSans-BoldItalic.ttf',
    '/fonts/dm-sans/DMSans-ExtraBold.ttf',
    '/fonts/dm-sans/DMSans-ExtraBoldItalic.ttf',
    '/fonts/dm-sans/DMSans-Black.ttf',
    '/fonts/dm-sans/DMSans-BlackItalic.ttf',
    '/fonts/inter/Inter_18pt-Thin.ttf',
    '/fonts/inter/Inter_18pt-ThinItalic.ttf',
    '/fonts/inter/Inter_18pt-ExtraLight.ttf',
    '/fonts/inter/Inter_18pt-ExtraLightItalic.ttf',
    '/fonts/inter/Inter_18pt-Light.ttf',
    '/fonts/inter/Inter_18pt-LightItalic.ttf',
    '/fonts/inter/Inter_18pt-Regular.ttf',
    '/fonts/inter/Inter_18pt-Italic.ttf',
    '/fonts/inter/Inter_18pt-Medium.ttf',
    '/fonts/inter/Inter_18pt-MediumItalic.ttf',
    '/fonts/inter/Inter_18pt-SemiBold.ttf',
    '/fonts/inter/Inter_18pt-SemiBoldItalic.ttf',
    '/fonts/inter/Inter_18pt-Bold.ttf',
    '/fonts/inter/Inter_18pt-BoldItalic.ttf',
    '/fonts/inter/Inter_18pt-ExtraBold.ttf',
    '/fonts/inter/Inter_18pt-ExtraBoldItalic.ttf',
    '/fonts/inter/Inter_18pt-Black.ttf',
    '/fonts/inter/Inter_18pt-BlackItalic.ttf',
]

self.addEventListener('install', async (event) => {
    event.waitUntil(caches.open('fonts').then((cache) => cache.addAll(fonts)))
})

self.addEventListener('fetch', async (event) => {
    if (event.request.url.includes('/fonts/')) {
        event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)))
    }
})