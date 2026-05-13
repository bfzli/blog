import type { APIRoute, GetStaticPaths } from 'astro'
import type { OgImageProps } from '@/types'

import { getCollection } from 'astro:content'
import { vibeCoding } from '@/data/products'
import { staticPages } from '@/data/pages'
import { generateOgImage } from '@/utils/og'

export const prerender = true

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

    const staticPaths = Object.values(staticPages).map((page) => ({
        params: { slug: page.slug },
        props: { title: page.title, description: page.description },
    }))

    return [...staticPaths, ...postPaths, ...productPaths]
}

export const GET: APIRoute = async ({ props }) => {
    const { title, description } = props as OgImageProps
    const image = await generateOgImage(title, description)

    return new Response(new Uint8Array(image), {
        headers: {
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    })
}
