import type { PostQueue } from '@/types'

import fs from 'node:fs'

export const QUEUE_FILE = 'scripts/queue.json'

export const readQueue = (): PostQueue => {
    if (!fs.existsSync(QUEUE_FILE)) return { generatedAt: '', ideas: [] }

    return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8')) as PostQueue
}

export const writeQueue = (queue: PostQueue) =>
    fs.writeFileSync(QUEUE_FILE, `${JSON.stringify(queue, null, 4)}\n`)