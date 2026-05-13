import type { Experience } from '@/types'
import { modulify, azwedo, dreampix, trokit } from '@/assets'

export const experience: Experience[] = [
    {
        company: 'Modulify',
        title: 'Principal Engineer',
        date: '2024 - Current',
        logo: modulify,
        bullets: [
            'Leading and managing the entire Modulify ecosystem including apps, Web, Webflow, CLI and APIs, while ensuring all Modulify AI services consistently run at peak performance.',
        ],
    },
    {
        company: 'Azwedo',
        title: 'Software Engineer',
        date: '2022 - 2024',
        logo: azwedo,
        bullets: [
            'Led and actively participated in the client back-end development, deployment, and maintenance of the Merrfal project, a cause that brings humanity back to life.',
            'Involved in the development of mini apps and their admin panels for content management. List of the apps: Ikonik for Figma, Ikonik for Canva, Ikonik for Webflow, Modulo, Goat Slider, Text Wizard AI, Svgflow, and LogoToUse.',
            'Managed and led a team in developing the entire backend and client-side infrastructure of Landdding, using GraphQL. And implementing a advanced cron structure for functionality.',
        ],
    },
    {
        company: 'Dreampix',
        title: 'Lead Developer',
        date: '2021 - 2022',
        logo: dreampix,
        bullets: [
            'Built and led development of an AI-powered wallpaper platform, implementing content distribution features while scaling the system for high-volume usage.',
        ],
    },
    {
        company: 'Trokit',
        title: 'Full Stack Developer',
        date: '2019 - 2020',
        logo: trokit,
        bullets: [
            'Built and led a full-stack SaaS car management platform for garage operations and workflows, ensuring performance, reliability, and structured system design.',
        ],
    },
    {
        company: 'NuN Bookhouse',
        title: 'Developer',
        date: '2019',
        bullets: [
            'Developed and maintained custom software for the Bookhouse e-commerce platform, handling infrastructure and system architecture, and optimizing overall application performance.',
        ],
    },
]

export const technical = {
    languages: [
        { name: 'TypeScript, JavaScript', icon: '/tech-icons/typescript.svg' },
        { name: 'Next.js, Astro, Vite', icon: '/tech-icons/nextjs.svg' },
        { name: 'React, Native, Expo', icon: '/tech-icons/react.svg' },
        { name: 'Node, Express, Electron', icon: '/tech-icons/nodejs.svg' },
        { name: 'Bun, Hono, Elysia', icon: '/tech-icons/bun.svg' },
        { name: 'CLI’s, Rollup, Webpack', icon: '/tech-icons/rollup.svg' },
    ],
    tools: [
        { name: 'GraphQL, Apollo', icon: '/tech-icons/graphql.svg' },
        { name: 'Firebase, Firestore', icon: '/tech-icons/firebase.svg' },
        { name: 'Prisma, Neon, Turso', icon: '/tech-icons/prisma.svg' },
        { name: 'Mongo, PostgreSQL', icon: '/tech-icons/mongodb.svg' },
        { name: 'Redux, Redux Toolkit, Zustand', icon: '/tech-icons/redux.svg' },
        { name: 'Tailwind, Shadcn', icon: '/tech-icons/tailwind.svg' },
        { name: 'Storybook, Vitest, Jest', icon: '/tech-icons/storybook.svg' },
    ],
    devops: [
        { name: 'Cloudflare', icon: '/tech-icons/cloudflare.svg' },
        { name: 'AWS', icon: '/tech-icons/aws.svg' },
        { name: 'Google Cloud', icon: '/tech-icons/googlecloud.svg' },
        { name: 'Vercel, Render, Railway', icon: '/tech-icons/vercel.svg' },
        { name: 'DigitalOcean, Fly.io', icon: '/tech-icons/digitalocean.svg' },
    ],
    others: [
        { name: 'Claude, v0, z.ai', icon: '/tech-icons/claude.svg' },
        { name: 'Figma', icon: '/tech-icons/figma.svg' },
        { name: 'Webflow', icon: '/tech-icons/webflow.svg' },
    ],
}
