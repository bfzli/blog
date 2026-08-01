import { MODEL, VOICE, openai } from './lib/openai'
import { publishedSlugs, readPublished, writePost } from './lib/posts'
import { readQueue, writeQueue } from './lib/queue'

const dryRun = process.argv.includes('--dry-run')

const buildPrompt = (
    title: string,
    description: string,
    angle: string,
    samples: string
) => `Write a detailed technical blog post.

${VOICE}

Two of his existing posts, for tone reference:
${samples}

Title: ${title}
Description: ${description}
What this post must cover: ${angle}

Requirements:
- 1200 to 1800 words.
- Start with the concrete situation that led to the post. No preamble, no restating the title.
- Use "## " section headings. Do not use a top-level "# " heading, the site renders the title separately.
- Include real, runnable code blocks with language tags wherever code clarifies the point. Prefer TypeScript unless the topic demands otherwise.
- Be specific: exact commands, exact error strings, exact package names.
- Close with what actually changed or what he would do differently, not a generic summary.
- Output GitHub-flavored Markdown body only. No frontmatter, no code fence around the whole thing.`

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

    const samples = readPublished()
        .slice(0, 2)
        .map((post) => `- ${post.title}: ${post.description}`)
        .join('\n')

    console.log(`Writing: ${idea.title}`)

    const response = await openai().responses.create({
        model: MODEL,
        input: [
            {
                role: 'user',
                content: buildPrompt(
                    idea.title,
                    idea.description,
                    idea.angle,
                    samples
                )
            }
        ],
        max_output_tokens: 16000
    })

    const body = response.output_text.trim()

    if (body.length < 800) {
        throw new Error(`Model returned only ${body.length} characters`)
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