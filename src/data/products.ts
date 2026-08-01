import type { Venture, VibeCoding } from '@/types'

import {
    envless,
    ip2geo,
    wallpapppers,
    launchdock,
    cloudagents,
    // uebfaqe,
    pikegjaku,
    focux,
    muslimTab
} from '@/assets'

export const ventures: Venture[] = [
    {
        name: 'Envless',
        description: 'Environment variables, without the mess.',
        icon: envless,
        url: 'https://envless.cloud'
    },
    {
        name: 'Ip2Geo',
        description: "Programmatically convert IP's into GEO location data.",
        icon: ip2geo,
        url: 'https://ip2geo.dev'
    },
    {
        name: 'Wallpapppers',
        description: 'The next-generation wallpaper platform powered by AI.',
        icon: wallpapppers,
        url: 'https://wallpapppers.com'
    },
    {
        name: 'Launchdock',
        description: 'Where self-hosting takes off without limits.',
        icon: launchdock,
        url: 'https://launchdock.sh'
    },
    {
        name: 'Cloudagents',
        description: 'One-click cloud hosting for OpenClaw AI agents.',
        icon: cloudagents,
        url: 'https://cloudagents.run'
    },
    // {
    //     name: 'Uebfaqe',
    //     description: 'Krijo uebfaqen tënde me AI brenda pak minutash.',
    //     icon: uebfaqe,
    //     url: 'https://uebfaqe.ai'
    // },
    {
        name: 'Pikëgjaku',
        description: 'Dhuro gjak — sot për dikë, nesër për ty.',
        icon: pikegjaku,
        url: 'https://pikegjaku.com'
    }
]

export const vibeCoding: VibeCoding[] = [
    {
        slug: 'focux',
        name: 'Focux',
        description: 'Focus On What Matters Most.',
        longDescription:
            'Focux is a Chrome extension designed to help you stay focused and productive while browsing the web. It blocks distracting websites, tracks your browsing habits, and provides insights into how you spend your time online. Whether you are working on a project, studying, or just trying to be more mindful of your screen time, Focux helps you take control of your browsing experience.',
        icon: focux,
        url: 'https://chromewebstore.google.com/detail/focux-focus-on-what-matte/galdchdmjdpoacaombhheafeikflcfad',
        actionText: 'Install Extension',
        actionIcon: 'https://cdn.simpleicons.org/google',
        tags: [
            'chrome-extension',
            'productivity',
            'focus',
            'browser-extension'
        ],
        privacyPolicy:
            'Focux is committed to protecting your privacy. We do not collect, store, or share any personal data whatsoever. All browsing data, settings, and preferences are stored exclusively on your device and never leave your browser. We do not use any analytics, tracking tools, or third-party services that could access your information. Your privacy is completely protected, and you can use Focux with complete confidence that your data remains yours alone.'
    },
    {
        slug: 'muslim-tab',
        name: 'Muslim Tab',
        description: 'Each Tab, a Reflection.',
        longDescription:
            'Muslim Tab transforms your new tab page into a peaceful space for Islamic inspiration. Every time you open a new tab, you are greeted with beautiful backgrounds, daily Quran verses, Hadith reminders, and accurate prayer times based on your location. It is designed to help you stay connected to your faith throughout the day while browsing the web.',
        icon: muslimTab,
        url: 'https://chromewebstore.google.com/detail/muslim-tab-each-tab-a-ref/jjnohnifpemmdnbidcgcojdjfabfocgm',
        actionText: 'Install Extension',
        actionIcon: 'https://cdn.simpleicons.org/google',
        tags: [
            'chrome-extension',
            'islamic',
            'prayer-times',
            'new-tab',
            'browser-extension'
        ],
        privacyPolicy:
            'Muslim Tab is committed to protecting your privacy. We do not collect, store, or share any personal data whatsoever. Location data, if used, is processed exclusively on your device to calculate prayer times and is never sent to any server or third-party service. We do not use any analytics, tracking tools, or data collection mechanisms. All preferences, settings, and data are stored locally in your browser and never leave your device. Your privacy is completely protected, and you can use Muslim Tab with complete confidence that your data remains yours alone.'
    }
]