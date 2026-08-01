import type { PostIdea, PublishedPost } from '@/types'

import fs from 'node:fs'
import path from 'node:path'

const POSTS_DIR = 'src/content/posts'

export const slugify = (title: string) =>
    title
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

export const readPublished = (): PublishedPost[] =>
    fs
        .readdirSync(POSTS_DIR)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
            const front = raw.split('---')[1] ?? ''

            const field = (name: string) => {
                const match = front.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))
                return (match?.[1] ?? '').trim().replace(/^['"]|['"]$/g, '')
            }

            return {
                slug: file.replace(/\.mdx$/, ''),
                title: field('title'),
                description: field('description'),
                tags: field('tags')
                    .replace(/^\[|\]$/g, '')
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                cell: field('cell')
            }
        })

export const publishedSlugs = () =>
    new Set(readPublished().map((post) => post.slug))

export const publishedCells = () =>
    new Set(readPublished().map((post) => post.cell).filter(Boolean))

const postDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

export const frontmatter = (idea: PostIdea, date: Date) =>
    [
        '---',
        `title: ${JSON.stringify(idea.title)}`,
        `description: ${JSON.stringify(idea.description)}`,
        `tags: [${idea.tags.map((tag) => JSON.stringify(tag)).join(', ')}]`,
        `date: ${postDate(date)}`,
        `cell: ${JSON.stringify(idea.cell)}`,
        '---'
    ].join('\n')

export const writePost = (idea: PostIdea, body: string, date = new Date()) => {
    const file = path.join(POSTS_DIR, `${idea.slug}.mdx`)

    if (fs.existsSync(file)) {
        throw new Error(`Refusing to overwrite existing post: ${file}`)
    }

    fs.writeFileSync(file, `${frontmatter(idea, date)}\n\n${body.trim()}\n`)

    return file
}