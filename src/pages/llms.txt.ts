import type { APIRoute } from 'astro'

import { getCollection } from 'astro:content'
import { llmsTxt, sortByDate } from '@/utils/markdown'

export const GET: APIRoute = async () => {
    const posts = sortByDate(await getCollection('posts'))

    return new Response(llmsTxt(posts), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate'
        }
    })
}