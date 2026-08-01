import { pageTitle } from '@/config'

export type StaticPageMeta = {
    slug: 'index' | 'products' | 'resume' | '404'
    title: string
    description: string
    keywords: string
}

export const staticPages: Record<StaticPageMeta['slug'], StaticPageMeta> = {
    index: {
        slug: 'index',
        title: pageTitle('Principal Engineer'),
        description: 'A place where I share my thoughts and learnings 💭',
        keywords:
            'uses, tools, web, software, personal, website, blog development, environment'
    },
    products: {
        slug: 'products',
        title: pageTitle('Products'),
        description: 'Products and projects by Benjamin Fazli',
        keywords: 'products, projects, software, development'
    },
    resume: {
        slug: 'resume',
        title: pageTitle('Resume'),
        description:
            'Resume of Benjamin Fazli, principal engineer at Modulify: roles, experience and a technical stack spanning TypeScript, Node, Bun, Astro and React.',
        keywords:
            'resume, cv, curriculum vitae, benjamin fazli, software engineer'
    },
    404: {
        slug: '404',
        title: pageTitle('Page Not Found'),
        description: 'The page you are looking for does not exist.',
        keywords: '404, not found'
    }
}