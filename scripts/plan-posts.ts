import type { PostIdea } from '@/types'

import { z } from 'zod'
import { zodTextFormat } from 'openai/helpers/zod'

import { MODEL, VOICE, logUsage, openai } from './lib/openai'
import {
    publishedCells,
    publishedSlugs,
    readPublished,
    slugify,
    tooSimilar
} from './lib/posts'
import { readQueue, writeQueue } from './lib/queue'
import { coverage, expand, readMatrix, sample } from './lib/matrix'

const TARGET = 7
const ASSIGNED_STACKS = 5
const SEED_TOPICS = 6

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

const prompt = (
    count: number,
    stacks: string[],
    seeds: string[],
    taken: string[],
    solved: string[]
) => `Plan ${count} blog posts for the coming week.

${VOICE}

Each post explains one concrete problem: what breaks, why it breaks, and how to fix it. These are reference posts about the problem itself, not personal stories and not a rewrite of the docs.

Cover these stacks, one post each:
${stacks.map((stack) => `- ${stack}`).join('\n')}

For the remaining ${count - stacks.length} posts, choose any stack, tool, runtime or platform you think is genuinely worth writing about. You are not limited to the list above.

These problem areas are a starting point only. Go beyond them freely, and prefer a specific problem you can picture someone actually hitting over a broad theme:
${seeds.map((seed) => `- ${seed}`).join('\n')}

Hard rules:
- Every post must be a different concrete problem. Two posts about the same root cause with a different symptom name do not count as different.
- No two titles may begin with the same word. Vary the shape: some name an error, some name a task, some name a decision.
- At least two posts must not be about fixing an error. Build something, ship something, or make an architectural call.
- The title must name the specific stack and the specific symptom or task. "Fixing window is not defined in Astro during SSR" is right. "Understanding SSR errors" is wrong.
- No listicles, no "top 10", no "ultimate guide", no generic overviews.

These titles already exist and must not be repeated or paraphrased:
${taken.map((title) => `- ${title}`).join('\n')}

These root problems are already covered. Do not write about them again, not even on a different stack, and not with a different symptom name for the same underlying cause:
${solved.map((problem) => `- ${problem}`).join('\n')}

For each idea provide:
- cell: a stable kebab-case key for the exact problem, shaped as problem::stack::context, for example err-require-esm::bun::at-build-time
- title: the post title
- description: one sentence under 160 characters, used as the meta description
- tags: 3 to 6 lowercase kebab-case tags
- angle: two or three sentences telling the writer what this post must cover and what the concrete takeaway is. Describe the problem and the fix, never a personal anecdote`

const main = async () => {
    const matrix = readMatrix()
    const published = readPublished()
    const queue = readQueue()

    const covered = new Set([
        ...publishedCells(),
        ...queue.ideas.map((idea) => idea.cell).filter(Boolean)
    ])

    if (showCoverage) {
        const cells = expand(matrix)
        const rows = coverage(cells, covered)
        const done = rows.reduce((sum, row) => sum + row.done, 0)

        console.log(`Seed matrix coverage: ${done} of ${cells.length} cells\n`)
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

    const stacks = sample(matrix.stacks, Math.min(ASSIGNED_STACKS, needed))
    const seeds = sample(
        matrix.topics.map((topic) => topic.label),
        SEED_TOPICS
    )

    console.log(`Planning ${needed} ideas, seeded stacks: ${stacks.join(', ')}`)

    const solved = [...covered]
        .map((key) => key.split('::')[0].replace(/-/g, ' '))
        .filter((problem, index, all) => problem && all.indexOf(problem) === index)

    const taken = [
        ...published.map((post) => post.title),
        ...queue.ideas.map((idea) => idea.title)
    ]

    const response = await openai().responses.parse({
        model: MODEL,
        input: [{ role: 'user', content: prompt(needed, stacks, seeds, taken, solved) }],
        text: { format: zodTextFormat(IdeaList, 'ideas') }
    })

    logUsage(response.usage)

    const parsed = response.output_parsed
    if (!parsed) throw new Error('Model returned no parsable ideas')

    const slugs = new Set([
        ...publishedSlugs(),
        ...queue.ideas.map((idea) => idea.slug)
    ])

    const fresh: PostIdea[] = []
    const rejected: string[] = []

    for (const idea of parsed.ideas) {
        const slug = slugify(idea.title)

        if (!slug || slugs.has(slug)) {
            rejected.push(`${idea.title} — duplicate slug`)
            continue
        }

        if (idea.cell && covered.has(idea.cell)) {
            rejected.push(`${idea.title} — problem already covered`)
            continue
        }

        const against = [...taken, ...fresh.map((accepted) => accepted.title)]

        if (tooSimilar(idea.title, against)) {
            rejected.push(`${idea.title} — too close to an existing title`)
            continue
        }

        if (idea.cell) covered.add(idea.cell)
        slugs.add(slug)
        fresh.push({ ...idea, slug })
    }

    console.log(`\n${parsed.ideas.length} returned, ${fresh.length} accepted`)

    for (const reason of rejected) console.log(`  rejected: ${reason}`)

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