import { MODEL, VOICE, logUsage, openai } from './lib/openai'
import { publishedSlugs, wordCount, writePost } from './lib/posts'
import { readQueue, writeQueue } from './lib/queue'
import { setOutput } from './lib/actions'

const MIN_WORDS = 900

const dryRun = process.argv.includes('--dry-run')

const buildPrompt = (
    title: string,
    description: string,
    angle: string
) => `Write a detailed technical blog post.

${VOICE}

Title: ${title}
Description: ${description}
What this post must cover: ${angle}

Requirements:
- 1200 to 1800 words.
- Open by stating what breaks and the literal error text. No story, no preamble, no restating the title.
- Use "## " section headings. Do not use a top-level "# " heading, the site renders the title separately.
- Include real, runnable code blocks with language tags wherever code clarifies the point. Prefer TypeScript unless the topic demands otherwise.
- Be specific: exact commands, exact error strings, exact package names.
- Close with the practical takeaway: which fix to prefer and why, or how to keep the problem from coming back. No reflection, no personal lesson.
- Output GitHub-flavored Markdown body only. No frontmatter, no code fence around the whole thing.
- The file is compiled as MDX, so a bare < or { in prose is a syntax error. Wrap every inline type, generic, HTML tag, JSX snippet, shell redirect and object literal in backticks, for example \`Array<string>\`, \`<script>\`, \`{ retries: 3 }\`. Fenced code blocks need no escaping.`

const main = async () => {
    const queue = readQueue()
    const published = publishedSlugs()

    const drafted = queue.drafted.filter((idea) => !published.has(idea.slug))
    const inFlight = new Set(drafted.map((idea) => idea.slug))

    const pending = queue.ideas.filter(
        (idea) => !published.has(idea.slug) && !inFlight.has(idea.slug)
    )

    if (!pending.length) {
        throw new Error(
            queue.ideas.length
                ? `All ${queue.ideas.length} queued ideas are already published or awaiting review, nothing to write`
                : 'Queue is empty, nothing to write. Run posts:plan to refill it'
        )
    }

    const [idea, ...rest] = pending

    console.log(`Writing: ${idea.title}`)

    const response = await openai().responses.create({
        model: MODEL,
        input: [
            {
                role: 'user',
                content: buildPrompt(
                    idea.title,
                    idea.description,
                    idea.angle
                )
            }
        ],
        max_output_tokens: 16000
    })

    logUsage(response.usage)

    if (response.status && response.status !== 'completed') {
        const reason = response.incomplete_details?.reason

        throw new Error(
            `Model stopped before finishing (status: ${response.status}${reason ? `, reason: ${reason}` : ''}), nothing written`
        )
    }

    const body = response.output_text.trim()
    const words = wordCount(body)

    console.log(`Prose words: ${words}`)

    if (words < MIN_WORDS) {
        throw new Error(
            `Model returned only ${words} prose words, below the ${MIN_WORDS} floor`
        )
    }

    if (dryRun) {
        console.log(`\n--- ${idea.slug}.mdx ---\n`)
        console.log(body)
        console.log(`\nDry run, nothing written. ${rest.length} would remain queued`)
        return
    }

    const file = writePost(idea, body, new Date())

    setOutput('title', idea.title)
    setOutput('slug', idea.slug)

    writeQueue({
        ...queue,
        ideas: rest,
        drafted: [...drafted, { ...idea, draftedAt: new Date().toISOString() }]
    })

    console.log(`Wrote ${file}`)
    console.log(
        `${rest.length} ideas remain in the queue, ${drafted.length + 1} awaiting review`
    )
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
})