import { defineCollection, z } from 'astro:content'

export const collections = {
    posts: defineCollection({
        schema: z.object({
            title: z.string(),
            description: z.string(),
            tags: z.array(z.string()),
            date: z.string(),
            cell: z.string().optional(),
            actionUrl: z.string().optional(),
            actionText: z.string().optional()
        })
    })
}