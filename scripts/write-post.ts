import { MODEL, VOICE, logUsage, openai } from './lib/openai'
import { publishedSlugs, wordCount, writePost } from './lib/posts'
import { readQueue, writeQueue } from './lib/queue'

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

    if (!queue.ideas.length) {
        console.log('Queue is empty, nothing to write')
        return
    }

    const published = publishedSlugs()
    const pending = queue.ideas.filter((idea) => !published.has(idea.slug))

    if (!pending.length) {
        console.log('Every queued idea is already published, clearing the queue')
        if (!dryRun) writeQueue({ ...queue, ideas: [] })
        return
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

    const body = response.output_text.trim()
    const words = wordCount(body)

    logUsage(response.usage)
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
    writeQueue({ ...queue, ideas: rest })

    console.log(`Wrote ${file}`)
    console.log(`${rest.length} ideas remain in the queue`)
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
})