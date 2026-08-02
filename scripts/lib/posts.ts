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

const TIME_ZONE = 'Europe/Skopje'

const postDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: TIME_ZONE
    })

const STOP_WORDS = new Set([
    'a',
    'an',
    'and',
    'at',
    'but',
    'during',
    'for',
    'from',
    'in',
    'is',
    'it',
    'not',
    'of',
    'on',
    'or',
    'that',
    'the',
    'then',
    'to',
    'when',
    'with'
])

const significant = (title: string) =>
    new Set(
        title
            .toLowerCase()
            .replace(/[^a-z0-9\s.]/g, ' ')
            .split(/\s+/)
            .filter((word) => word && !STOP_WORDS.has(word))
    )

export const tooSimilar = (title: string, others: string[], limit = 0.6) => {
    const words = significant(title)
    if (!words.size) return true

    return others.some((other) => {
        const against = significant(other)
        if (!against.size) return false

        let shared = 0
        for (const word of words) if (against.has(word)) shared += 1

        return shared / Math.min(words.size, against.size) > limit
    })
}

export const wordCount = (body: string) =>
    body
        .replace(/```[\s\S]*?```/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length

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

const escapeOutsideCode = (text: string) =>
    text
        .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
        .map((part, index) =>
            index % 2
                ? part
                : part.replace(/<(?=[a-zA-Z/])/g, '\\<').replace(/\{/g, '\\{')
        )
        .join('')

export const mdxSafe = (body: string) => escapeOutsideCode(body)

export const writePost = (idea: PostIdea, body: string, date = new Date()) => {
    const file = path.join(POSTS_DIR, `${idea.slug}.mdx`)

    if (fs.existsSync(file)) {
        throw new Error(`Refusing to overwrite existing post: ${file}`)
    }

    fs.writeFileSync(
        file,
        `${frontmatter(idea, date)}\n\n${mdxSafe(body.trim())}\n`
    )

    return file
}