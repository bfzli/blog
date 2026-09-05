import type { APIRoute, GetStaticPaths } from 'astro'

import { getCollection } from 'astro:content'
import { markdownPages } from '@/utils/markdown'
import { sortByDate } from '@/utils/posts'

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = sortByDate(await getCollection('posts'))

    return markdownPages(posts).map((page) => ({
        params: { slug: page.slug },
        props: { body: page.body }
    }))
}

export const GET: APIRoute = ({ props }) =>
    new Response(props.body as string, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate'
        }
    })