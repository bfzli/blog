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

export const nextCells = (
    cells: MatrixCell[],
    covered: Set<string>,
    count: number
) => {
    const open = cells.filter((cell) => !covered.has(cell.key))

    const byTopic = new Map<string, MatrixCell[]>()
    for (const cell of open) {
        const bucket = byTopic.get(cell.topic.id) ?? []
        bucket.push(cell)
        byTopic.set(cell.topic.id, bucket)
    }

    const buckets = [...byTopic.values()]
    const picked: MatrixCell[] = []

    for (let depth = 0; picked.length < count; depth++) {
        const before = picked.length

        for (const bucket of buckets) {
            if (picked.length >= count) break
            if (bucket[depth]) picked.push(bucket[depth])
        }

        if (picked.length === before) break
    }

    return picked
}

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

export const describe = (cell: MatrixCell) =>
    [cell.topic.label, cell.stack && `in ${cell.stack}`, cell.context]
        .filter(Boolean)
        .join(', ')