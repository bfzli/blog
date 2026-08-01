import type { MatrixCell, PostIdea } from '@/types'

import { z } from 'zod'
import { zodTextFormat } from 'openai/helpers/zod'

import { MODEL, VOICE, openai } from './lib/openai'
import { publishedCells, publishedSlugs, readPublished, slugify } from './lib/posts'
import { readQueue, writeQueue } from './lib/queue'
import { coverage, describe, expand, nextCells, readMatrix } from './lib/matrix'

const TARGET = 7

const IdeaList = z.object({
    ideas: z.array(
        z.object({
            cell: z.string(),
            title: z.string(),
            description: z.string(),
            tags: z.array(z.string()),
            angle: z.string()
        })
    )
})

const dryRun = process.argv.includes('--dry-run')
const showCoverage = process.argv.includes('--coverage')

const prompt = (cells: MatrixCell[], taken: string[]) => `Write one blog post idea for each of the assignments below. Each assignment is a specific problem in a specific stack.

${VOICE}

Assignments:
${cells.map((cell) => `- cell "${cell.key}": ${describe(cell)}`).join('\n')}

Rules:
- Return exactly one idea per cell, echoing the cell key verbatim.
- The title must name the specific stack and the specific symptom or task. "Fixing window is not defined in Astro during SSR" is right. "Understanding SSR errors" is wrong.
- Treat each assignment as a post written from real hands-on debugging or building, not a reference page.
- No listicles, no "top 10", no "ultimate guide", no generic overviews.

These titles already exist and must not be repeated or paraphrased:
${taken.map((title) => `- ${title}`).join('\n')}

For each idea provide:
- cell: the cell key, copied exactly
- title: the post title
- description: one sentence under 160 characters, used as the meta description
- tags: 3 to 6 lowercase kebab-case tags
- angle: two or three sentences telling the writer what this post must cover and what the concrete takeaway is`

const main = async () => {
    const matrix = readMatrix()
    const cells = expand(matrix)

    const published = readPublished()
    const queue = readQueue()

    const covered = new Set([
        ...publishedCells(),
        ...queue.ideas.map((idea) => idea.cell).filter(Boolean)
    ])

    if (showCoverage) {
        const rows = coverage(cells, covered)
        const done = rows.reduce((sum, row) => sum + row.done, 0)

        console.log(`Coverage: ${done} of ${cells.length} cells\n`)
        for (const row of rows) {
            console.log(
                `${String(row.done).padStart(4)} / ${String(row.total).padEnd(4)}  ${row.label}`
            )
        }
        return
    }

    const needed = TARGET - queue.ideas.length

    if (needed <= 0) {
        console.log(`Queue already holds ${queue.ideas.length} ideas`)
        return
    }

    const targets = nextCells(cells, covered, needed)

    if (!targets.length) {
        console.log(
            `Every one of the ${cells.length} cells is covered. Add topics or stacks to scripts/topics.json`
        )
        return
    }

    console.log(`Claiming ${targets.length} cells:`)
    for (const cell of targets) console.log(`  ${cell.key}`)

    const taken = [
        ...published.map((post) => post.title),
        ...queue.ideas.map((idea) => idea.title)
    ]

    const response = await openai().responses.parse({
        model: MODEL,
        input: [{ role: 'user', content: prompt(targets, taken) }],
        text: { format: zodTextFormat(IdeaList, 'ideas') }
    })

    const parsed = response.output_parsed
    if (!parsed) throw new Error('Model returned no parsable ideas')

    const wanted = new Map(targets.map((cell) => [cell.key, cell]))
    const slugs = new Set([
        ...publishedSlugs(),
        ...queue.ideas.map((idea) => idea.slug)
    ])

    const fresh: PostIdea[] = []

    for (const idea of parsed.ideas) {
        if (!wanted.has(idea.cell) || covered.has(idea.cell)) continue

        const slug = slugify(idea.title)
        if (!slug || slugs.has(slug)) continue

        covered.add(idea.cell)
        slugs.add(slug)
        fresh.push({ ...idea, slug })
    }

    console.log(`\n${parsed.ideas.length} returned, ${fresh.length} accepted`)

    if (!fresh.length) {
        console.log('Nothing usable came back')
        return
    }

    const next = {
        generatedAt: new Date().toISOString(),
        ideas: [...queue.ideas, ...fresh]
    }

    console.log()
    for (const idea of next.ideas) console.log(`- ${idea.title}`)

    if (dryRun) {
        console.log('\nDry run, queue not written')
        return
    }

    writeQueue(next)
    console.log(`\nQueue now holds ${next.ideas.length} ideas`)
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
})