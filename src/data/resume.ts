import type { Experience, Skill, TechnicalGroup } from '@/types'
import { modulify, azwedo, dreampix, trokit, nun } from '@/assets'

export const experience: Experience[] = [
    {
        company: 'Modulify',
        title: 'Principal Engineer',
        logo: modulify,
        description:
            'Leading and managing the entire Modulify ecosystem including apps, Web, Webflow, CLI and APIs, while ensuring all Modulify AI services consistently run at peak performance.'
    },
    {
        company: 'Azwedo',
        title: 'Software Engineer',
        logo: azwedo,
        description:
            'Led back-end work on Merrfal, built Landdding end to end with GraphQL, and shipped mini apps with admin panels like Ikonik, Modulo, Goat Slider, Text Wizard AI, Svgflow and LogoToUse.'
    },
    {
        company: 'Dreampix',
        title: 'Lead Developer',
        logo: dreampix,
        description:
            'Built and led development of an AI-powered wallpaper platform, implementing content distribution features while scaling the system for high-volume usage.'
    },
    {
        company: 'Trokit',
        title: 'Full Stack Developer',
        logo: trokit,
        description:
            'Built and led a full-stack SaaS car management platform for garage operations and workflows, ensuring performance, reliability, and structured system design.'
    },
    {
        company: 'NuN Bookhouse',
        logo: nun,
        title: 'Developer',
        description:
            'Developed and maintained custom software for the Bookhouse e-commerce platform, handling infrastructure and system architecture, and optimizing overall application performance.'
    }
]

export const technical: Record<TechnicalGroup['key'], Skill[]> = {
    languages: [
        { name: 'TypeScript, JavaScript', icon: 'typescript' },
        { name: 'Next.js, Astro, Vite', icon: 'nextjs' },
        { name: 'React, Native, Expo', icon: 'react' },
        { name: 'Node, Express, Electron', icon: 'nodejs' },
        { name: 'Bun, Hono, Elysia', icon: 'bun' },
        { name: 'CLI’s, Rollup, Webpack', icon: 'rollup' }
    ],
    tools: [
        { name: 'GraphQL, Apollo', icon: 'graphql' },
        { name: 'Firebase, Firestore', icon: 'firebase' },
        { name: 'Prisma, Neon, Turso', icon: 'prisma' },
        { name: 'Mongo, PostgreSQL', icon: 'mongodb' },
        {
            name: 'Redux, Redux Toolkit, Zustand',
            icon: 'redux'
        },
        { name: 'Tailwind, Shadcn', icon: 'tailwind' },
        { name: 'Storybook, Vitest, Jest', icon: 'storybook' }
    ],
    devops: [
        { name: 'Cloudflare', icon: 'cloudflare' },
        { name: 'AWS', icon: 'aws' },
        { name: 'Google Cloud', icon: 'googlecloud' },
        { name: 'Vercel, Render, Railway', icon: 'vercel' },
        { name: 'DigitalOcean, Fly.io', icon: 'digitalocean' }
    ],
    others: [
        { name: 'Claude, v0, z.ai', icon: 'claude' },
        { name: 'Figma', icon: 'figma' },
        { name: 'Webflow', icon: 'webflow' }
    ]
}

export const skillGroups: TechnicalGroup[] = [
    { title: 'Languages', key: 'languages' },
    { title: 'Tools & Databases', key: 'tools' },
    { title: 'DevOps & Cloud', key: 'devops' },
    { title: 'AI & Others', key: 'others' }
]