import type { APIRoute, GetStaticPaths } from 'astro'

import { getCollection } from 'astro:content'
import { vibeCoding } from '@/data/products'
import { generateOgImage } from '@/utils/og'

const staticPages = [
    {
        slug: 'index',
        title: 'Software Engineer - Benjamin Fazli',
        description: 'A place where I share my thoughts and learnings.',
    },
    {
        slug: 'products',
        title: 'Products - Benjamin Fazli',
        description: 'Products and projects by Benjamin Fazli.',
    },
    {
        slug: 'resume',
        title: 'Resume - Benjamin Fazli',
        description: 'Resume of Benjamin Fazli - Software Engineer.',
    },
]

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getCollection('posts')

    const postPaths = posts.map((post) => ({
        params: { slug: post.slug },
        props: { title: post.data.title, description: post.data.description },
    }))

    const productPaths = vibeCoding.map((product) => ({
        params: { slug: `products/${product.slug}` },
        props: { title: `${product.name} - Benjamin Fazli`, description: product.description },
    }))

    const staticPaths = staticPages.map((page) => ({
        params: { slug: page.slug },
        props: { title: page.title, description: page.description },
    }))

    return [...staticPaths, ...postPaths, ...productPaths]
}

export const GET: APIRoute = async ({ props }) => {
    const { title, description } = props as { title: string; description: string }
    const image = await generateOgImage(title, description)

    return new Response(image, {
        headers: {
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    })
}
