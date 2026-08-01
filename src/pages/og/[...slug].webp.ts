import type { APIRoute, GetStaticPaths } from 'astro'
import type { OgImageProps } from '@/types'

import { getCollection } from 'astro:content'
import { pageTitle } from '@/config'
import { staticPages } from '@/data/pages'
import { vibeCoding } from '@/data/products'
import { generateOgImage } from '@/utils/og'

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getCollection('posts')

    const postPaths = posts.map((post) => ({
        params: { slug: post.slug },
        props: { title: post.data.title, description: post.data.description }
    }))

    const staticPaths = Object.values(staticPages).map((page) => ({
        params: { slug: page.slug },
        props: { title: page.title, description: page.description }
    }))

    const privacyPaths = vibeCoding.map((app) => ({
        params: { slug: `privacy/${app.slug}` },
        props: {
            title: pageTitle(`${app.name} Privacy Policy`),
            description: `Privacy policy for the ${app.name} Chrome extension.`
        }
    }))

    return [...staticPaths, ...postPaths, ...privacyPaths]
}

export const GET: APIRoute = async ({ props }) => {
    const { title, description } = props as OgImageProps
    const image = await generateOgImage(title, description)

    return new Response(new Uint8Array(image), {
        headers: {
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    })
}