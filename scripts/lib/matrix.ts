import type { MatrixCell, TopicMatrix } from '@/types'

import fs from 'node:fs'

export const TOPICS_FILE = 'scripts/topics.json'

export const readMatrix = (): TopicMatrix =>
    JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf-8')) as TopicMatrix

export const cellKey = (topicId: string, stack: string, context: string) =>
    [topicId, stack, context].filter(Boolean).join('::')

export const expand = (matrix: TopicMatrix): MatrixCell[] =>
    matrix.topics.flatMap((topic) => {
        const stacks = topic.stacks.length ? topic.stacks : ['']
        const contexts = topic.contexts.length ? topic.contexts : ['']

        return contexts.flatMap((context) =>
            stacks.map((stack) => ({
                key: cellKey(topic.id, stack, context),
                topic,
                stack,
                context
            }))
        )
    })

export const coverage = (cells: MatrixCell[], covered: Set<string>) => {
    const rows = new Map<string, { done: number; total: number }>()

    for (const cell of cells) {
        const row = rows.get(cell.topic.label) ?? { done: 0, total: 0 }
        row.total += 1
        if (covered.has(cell.key)) row.done += 1
        rows.set(cell.topic.label, row)
    }

    return [...rows.entries()].map(([label, row]) => ({ label, ...row }))
}

export const sample = <T,>(items: T[], count: number) => {
    const pool = [...items]

    for (let index = pool.length - 1; index > 0; index--) {
        const swap = Math.floor(Math.random() * (index + 1))
        ;[pool[index], pool[swap]] = [pool[swap], pool[index]]
    }

    return pool.slice(0, count)
}