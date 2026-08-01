import type { Greeting } from '@/types'

const location = 'Skopje, North Macedonia'

const profile = {
    name: 'Benjamin Fazli',
    shortName: 'Benjamin',
    description: 'Expresing my thoughts and ideas through code and writing.',
    bio: `A curious software engineer based in ${location}, solving engineering problems, building products people use, and sharing what I learn along the way.`,
    location,
    image: '/og/index.png',
    username: 'bfzli',
    birthDate: new Date('2001-01-17'),
    links: {
        email: 'mailto:bfzli@hotmail.com',
        github: 'https://github.com/bfzli',
        twitter: 'https://twitter.com/bfzli',
        linkedIn: 'https://www.linkedin.com/in/benjaminfzl'
    }
}

const greeting = {
    interval: 2600,
    words: [
        { text: 'Hello', lang: 'en' },
        { text: 'Përshëndetje', lang: 'sq' },
        { text: 'Bonjour', lang: 'fr' },
        { text: 'Hallo', lang: 'de' },
        { text: 'مرحبا', lang: 'ar', dir: 'rtl' },
        { text: '你好', lang: 'zh' },
        { text: 'Hola', lang: 'es' }
    ] as Greeting[]
}

export const constants = {
    profile,
    greeting,
    site: 'https://bfzli.com',
    links: {
        external: [
            { name: 'Email', link: profile.links.email },
            { name: 'LinkedIn', link: profile.links.linkedIn },
            { name: 'GitHub', link: profile.links.github },
            { name: 'X', link: profile.links.twitter }
        ]
    }
}

export const pageTitle = (label: string) => `${label} - ${profile.shortName}`