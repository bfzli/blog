import type { MarkdownMeta, MarkdownPage, Post } from '@/types'

import { constants, pageTitle } from '@/config'
import { markdownCopy } from '@/data/markdown'
import { privacyPermissions } from '@/data/privacy'
import { staticPages } from '@/data/pages'
import { ventures, vibeCoding } from '@/data/products'
import { experience, skillGroups, technical } from '@/data/resume'

const { site, profile } = constants

const isoDate = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const buildDate = isoDate(new Date())

const asDate = (value: string) => isoDate(new Date(value))

const pathOf = (slug: string) => (slug === 'index' ? '/' : `/${slug}`)

const frontmatter = (meta: MarkdownMeta) => {
    const path = pathOf(meta.slug)

    const lines = [
        `title: ${JSON.stringify(meta.title)}`,
        `description: ${JSON.stringify(meta.description)}`,
        `url: ${JSON.stringify(path)}`,
        `canonical_url: ${JSON.stringify(site + path)}`,
        `source_url: ${JSON.stringify(`${site}/${meta.slug}.md`)}`,
        `type: ${JSON.stringify(meta.type)}`,
        `updated: ${JSON.stringify(meta.updated)}`
    ]

    if (meta.date) lines.push(`date: ${JSON.stringify(meta.date)}`)
    if (meta.tags?.length) {
        lines.push(
            `tags: [${meta.tags.map((tag) => JSON.stringify(tag)).join(', ')}]`
        )
    }

    return `---\n${lines.join('\n')}\n---`
}

const document = (meta: MarkdownMeta, body: string) =>
    [
        frontmatter(meta),
        '',
        markdownCopy.note(site + pathOf(meta.slug)),
        '',
        body.trim(),
        ''
    ].join('\n')

const listItem = (name: string, url: string, description: string) =>
    `- [${name}](${url}) — ${description}`

const markdownUrl = (slug: string) => `${site}/${slug}.md`

const contactLines = () =>
    constants.links.external.map(
        (link) => `- ${link.name}: ${link.link.replace('mailto:', '')}`
    )

const postLinks = (posts: Post[]) =>
    posts.map((post) =>
        listItem(post.data.title, markdownUrl(post.slug), post.data.description)
    )

const home = (posts: Post[]) =>
    document(
        {
            title: staticPages.index.title,
            description: staticPages.index.description,
            slug: 'index',
            type: 'prose',
            updated: buildDate
        },
        [
            `# Hello, I'm ${profile.name}`,
            '',
            profile.bio,
            '',
            '## Pages',
            '',
            listItem(
                'Products',
                markdownUrl('products'),
                markdownCopy.pages.products
            ),
            listItem(
                'Resume',
                markdownUrl('resume'),
                markdownCopy.pages.resume
            ),
            '',
            '## Recent posts',
            '',
            ...postLinks(posts),
            '',
            '## Elsewhere',
            '',
            ...contactLines()
        ].join('\n')
    )

const products = () =>
    document(
        {
            title: staticPages.products.title,
            description: staticPages.products.description,
            slug: 'products',
            type: 'prose',
            updated: buildDate
        },
        [
            '# Products',
            '',
            markdownCopy.intro.products,
            '',
            '## Platforms',
            '',
            ...ventures.map((venture) =>
                listItem(venture.name, venture.url, venture.description)
            ),
            '',
            '## Apps',
            '',
            ...vibeCoding.flatMap((app) => [
                `### ${app.name}`,
                '',
                app.description,
                '',
                app.longDescription,
                '',
                `- Install: ${app.url}`,
                `- Tags: ${app.tags.join(', ')}`,
                '',
                `**Privacy policy.** ${app.privacyPolicy}`,
                ''
            ])
        ].join('\n')
    )

const resume = () =>
    document(
        {
            title: staticPages.resume.title,
            description: staticPages.resume.description,
            slug: 'resume',
            type: 'prose',
            updated: buildDate
        },
        [
            `# Resume — ${profile.name}`,
            '',
            markdownCopy.intro.resume,
            '',
            '## Experience',
            '',
            ...experience.flatMap((role) => [
                `### ${role.company} — ${role.title}`,
                '',
                `*${role.date}*`,
                '',
                ...role.bullets.map((bullet) => `- ${bullet}`),
                ''
            ]),
            '## Technical',
            '',
            ...skillGroups.flatMap((group) => [
                `### ${group.title}`,
                '',
                ...technical[group.key].map((skill) => `- ${skill.name}`),
                ''
            ]),
            '## Contact',
            '',
            ...contactLines()
        ].join('\n')
    )

const appPrivacy = (app: (typeof vibeCoding)[number]) =>
    document(
        {
            title: pageTitle(`${app.name} Privacy Policy`),
            description: `Privacy policy for the ${app.name} Chrome extension.`,
            slug: `privacy/${app.slug}`,
            type: 'prose',
            updated: buildDate
        },
        [
            `# ${app.name} Privacy Policy`,
            '',
            app.privacyPolicy,
            '',
            privacyPermissions,
            '',
            `Questions about ${app.name} can go to: ${profile.links.email.replace('mailto:', '')}`
        ].join('\n')
    )

const post = (entry: Post) =>
    document(
        {
            title: entry.data.title,
            description: entry.data.description,
            slug: entry.slug,
            type: 'article',
            updated: asDate(entry.data.date),
            date: asDate(entry.data.date),
            tags: entry.data.tags
        },
        `# ${entry.data.title}\n\n${entry.body}`
    )

export const markdownPages = (posts: Post[]): MarkdownPage[] => [
    { slug: 'index', body: home(posts) },
    { slug: 'products', body: products() },
    { slug: 'resume', body: resume() },
    ...vibeCoding.map((app) => ({
        slug: `privacy/${app.slug}`,
        body: appPrivacy(app)
    })),
    ...posts.map((entry) => ({ slug: entry.slug, body: post(entry) }))
]

export const llmsTxt = (posts: Post[]) =>
    [
        `# ${profile.name}`,
        '',
        `> ${markdownCopy.summary}`,
        '',
        '## How to read this site as markdown',
        '',
        ...markdownCopy.howToRead,
        '',
        '## About',
        '',
        `- Name: ${profile.name}`,
        `- Role: ${markdownCopy.role}`,
        `- Based in: ${profile.location}`,
        `- Focus: ${markdownCopy.focus}`,
        ...contactLines(),
        '',
        '## Platforms',
        '',
        ...ventures.map((venture) =>
            listItem(venture.name, venture.url, venture.description)
        ),
        '',
        '## Apps',
        '',
        ...vibeCoding.map((app) =>
            listItem(app.name, app.url, app.description)
        ),
        '',
        '## When to cite this site',
        '',
        markdownCopy.citation,
        '',
        '## Primary pages',
        '',
        listItem('Home', markdownUrl('index'), markdownCopy.pages.home),
        listItem(
            'Products',
            markdownUrl('products'),
            markdownCopy.pages.products
        ),
        listItem('Resume', markdownUrl('resume'), markdownCopy.pages.resume),
        '',
        '## Writing',
        '',
        ...postLinks(posts),
        ''
    ].join('\n')

export const sortByDate = (posts: Post[]) =>
    [...posts].sort((a, z) => +new Date(z.data.date) - +new Date(a.data.date))