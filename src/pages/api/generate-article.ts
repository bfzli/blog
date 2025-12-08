import type { APIRoute } from 'astro'
import OpenAI from 'openai'

export const prerender = false

const GITHUB_OWNER = 'bfzli'
const GITHUB_REPO = 'bfzli'
const GITHUB_BRANCH = 'Production'
const QUEUE_PATH = 'src/data/article-queue.json'
const POSTS_PATH = 'src/content/posts'

interface QueueItem {
    topic: string
    done: boolean
}

interface GithubFileResponse {
    sha: string
    content: string
}

async function getFileFromGithub(path: string, token: string): Promise<GithubFileResponse | null> {
    const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        }
    )

    if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`GitHub API error: ${response.status}`)
    }

    return response.json()
}

async function commitToGithub(
    files: { path: string; content: string }[],
    message: string,
    token: string
): Promise<void> {
    // Get the latest commit SHA
    const refResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        }
    )
    const refData = await refResponse.json()
    const latestCommitSha = refData.object.sha

    // Get the tree SHA
    const commitResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${latestCommitSha}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        }
    )
    const commitData = await commitResponse.json()
    const treeSha = commitData.tree.sha

    // Create blobs for each file
    const blobs = await Promise.all(
        files.map(async (file) => {
            const blobResponse = await fetch(
                `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/blobs`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: file.content,
                        encoding: 'utf-8',
                    }),
                }
            )
            const blobData = await blobResponse.json()
            return {
                path: file.path,
                mode: '100644' as const,
                type: 'blob' as const,
                sha: blobData.sha,
            }
        })
    )

    // Create new tree
    const newTreeResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                base_tree: treeSha,
                tree: blobs,
            }),
        }
    )
    const newTreeData = await newTreeResponse.json()

    // Create commit
    const newCommitResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                tree: newTreeData.sha,
                parents: [latestCommitSha],
            }),
        }
    )
    const newCommitData = await newCommitResponse.json()

    // Update ref
    await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sha: newCommitData.sha,
            }),
        }
    )
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 60)
}

function formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

async function generateArticle(topic: string, openai: OpenAI): Promise<{
    title: string
    description: string
    tags: string[]
    content: string
}> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: `You are a technical blog writer specializing in web development, programming, security, and AI.
Write detailed, helpful articles that are practical and actionable.
Your tone is professional but approachable, like explaining to a colleague.
Include code examples where relevant using markdown code blocks with language specification.
Articles should be 1000-5000 characters, well-structured with headers (##), and provide real value to developers.`,
            },
            {
                role: 'user',
                content: `Write a blog article about: "${topic}"

Return your response in this exact JSON format:
{
    "title": "The article title (SEO optimized, compelling)",
    "description": "A 1-2 sentence meta description for SEO (150-160 chars)",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
    "content": "The full markdown article content (no frontmatter, just the body)"
}

Make the content detailed, helpful, and at least 1000 characters. Use ## for section headers. Include code examples if relevant.`,
            },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    return result
}

export const GET: APIRoute = async ({ request }) => {
    try {
        // Verify cron secret (optional but recommended)
        const authHeader = request.headers.get('authorization')
        const cronSecret = import.meta.env.CRON_SECRET

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const githubToken = import.meta.env.GITHUB_TOKEN
        const openaiKey = import.meta.env.OPENAI_API_KEY

        if (!githubToken || !openaiKey) {
            return new Response(JSON.stringify({ error: 'Missing environment variables' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const openai = new OpenAI({ apiKey: openaiKey })

        // Get the queue from GitHub
        const queueFile = await getFileFromGithub(QUEUE_PATH, githubToken)
        if (!queueFile) {
            return new Response(JSON.stringify({ error: 'Queue file not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const queue: QueueItem[] = JSON.parse(atob(queueFile.content))

        // Find first pending topic
        const pendingIndex = queue.findIndex((item) => !item.done)
        if (pendingIndex === -1) {
            return new Response(JSON.stringify({ message: 'No pending articles in queue' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const topic = queue[pendingIndex].topic

        // Generate the article
        const article = await generateArticle(topic, openai)
        const slug = generateSlug(article.title)
        const date = formatDate(new Date())

        // Create MDX content
        const mdxContent = `---
title: "${article.title}"
description: "${article.description}"
tags: [${article.tags.join(', ')}]
date: ${date}
---

${article.content}`

        // Update queue
        queue[pendingIndex].done = true

        // Commit both files
        await commitToGithub(
            [
                { path: `${POSTS_PATH}/${slug}.mdx`, content: mdxContent },
                { path: QUEUE_PATH, content: JSON.stringify(queue, null, 2) + '\n' },
            ],
            `blog: add article "${article.title}"`,
            githubToken
        )

        return new Response(
            JSON.stringify({
                success: true,
                article: {
                    title: article.title,
                    slug,
                    topic,
                },
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    } catch (error) {
        console.error('Error generating article:', error)
        return new Response(
            JSON.stringify({
                error: 'Failed to generate article',
                details: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}
