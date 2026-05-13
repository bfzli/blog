export type StaticPageMeta = {
    slug: 'index' | 'products' | 'resume' | '404'
    title: string
    description: string
    keywords: string
}

export const staticPages: Record<StaticPageMeta['slug'], StaticPageMeta> = {
    index: {
        slug: 'index',
        title: 'Software Engineer - Benjamin Fazli',
        description: 'A place where I share my thoughts and learnings 💭',
        keywords: 'uses, tools, web, software, personal, website, blog development, environment',
    },
    products: {
        slug: 'products',
        title: 'Products - Benjamin Fazli',
        description: 'Products and projects by Benjamin Fazli',
        keywords: 'products, projects, software, development',
    },
    resume: {
        slug: 'resume',
        title: 'Resume - Benjamin Fazli',
        description: 'Resume of Benjamin Fazli - Software Engineer',
        keywords: 'resume, cv, curriculum vitae, benjamin fazli, software engineer',
    },
    404: {
        slug: '404',
        title: 'Page Not Found - Benjamin Fazli',
        description: 'The page you are looking for does not exist.',
        keywords: '404, not found',
    },
}
