import type { DraftedIdea, PostIdea, PostQueue } from '@/types'

import fs from 'node:fs'

export const QUEUE_FILE = 'scripts/queue.json'

const EMPTY: PostQueue = { generatedAt: '', ideas: [], drafted: [] }

const isIdea = (value: unknown): value is PostIdea => {
    if (!value || typeof value !== 'object') return false

    const idea = value as Record<string, unknown>

    return (
        typeof idea.slug === 'string' &&
        idea.slug.length > 0 &&
        typeof idea.title === 'string' &&
        idea.title.length > 0
    )
}

export const readQueue = (): PostQueue => {
    if (!fs.existsSync(QUEUE_FILE)) return { ...EMPTY }

    const raw = fs.readFileSync(QUEUE_FILE, 'utf-8')

    let parsed: unknown

    try {
        parsed = JSON.parse(raw)
    } catch (error) {
        throw new Error(
            `${QUEUE_FILE} is not valid JSON: ${error instanceof Error ? error.message : error}`
        )
    }

    if (!parsed || typeof parsed !== 'object') {
        throw new Error(`${QUEUE_FILE} must contain an object`)
    }

    const queue = parsed as Record<string, unknown>
    const ideas = queue.ideas ?? []
    const drafted = queue.drafted ?? []

    if (!Array.isArray(ideas) || !ideas.every(isIdea)) {
        throw new Error(`${QUEUE_FILE} has a malformed "ideas" array`)
    }

    if (!Array.isArray(drafted) || !drafted.every(isIdea)) {
        throw new Error(`${QUEUE_FILE} has a malformed "drafted" array`)
    }

    return {
        generatedAt:
            typeof queue.generatedAt === 'string' ? queue.generatedAt : '',
        ideas: ideas as PostIdea[],
        drafted: drafted as DraftedIdea[]
    }
}

export const writeQueue = (queue: PostQueue) =>
    fs.writeFileSync(QUEUE_FILE, `${JSON.stringify(queue, null, 4)}\n`)