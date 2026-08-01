import type { ComponentProps } from 'solid-js'
import type { CollectionEntry } from 'astro:content'

export type HeadingProps = ComponentProps<'h1'>

export type Post = CollectionEntry<'posts'>

export type Props = {
    title: string
    description: string
    keywords: string
    image: string
    type: string
    date?: string
    tags?: string[]
}

export interface Venture {
    name: string
    description: string
    icon: ImageMetadata
    url: string
}

export interface VibeCoding {
    slug: string
    name: string
    description: string
    longDescription: string
    icon: ImageMetadata
    url: string
    privacyPolicy: string
    tags: string[]
    actionText?: string
    actionIcon?: string
}

export interface Experience {
    company: string
    title: string
    date: string
    logo?: ImageMetadata
    bullets: string[]
}

export type IconName =
    | 'arrowLeft'
    | 'arrowSquareOut'
    | 'calendarBlank'
    | 'monitor'
    | 'moon'
    | 'smileySad'
    | 'sun'

export interface IconProps {
    name: IconName
    class?: string
}

export type TechIconName =
    | 'aws'
    | 'bun'
    | 'claude'
    | 'cloudflare'
    | 'digitalocean'
    | 'figma'
    | 'firebase'
    | 'googlecloud'
    | 'graphql'
    | 'mongodb'
    | 'nextjs'
    | 'nodejs'
    | 'prisma'
    | 'react'
    | 'redux'
    | 'rollup'
    | 'storybook'
    | 'tailwind'
    | 'typescript'
    | 'vercel'
    | 'webflow'

export interface Skill {
    name: string
    icon: TechIconName
}

export interface TechnicalGroup {
    title: string
    key: 'languages' | 'tools' | 'devops' | 'others'
}

export interface Greeting {
    text: string
    lang: string
    dir?: 'rtl'
}

export interface MarkdownMeta {
    title: string
    description: string
    slug: string
    type: 'prose' | 'article'
    updated: string
    date?: string
    tags?: string[]
}

export interface PublishedPost {
    slug: string
    title: string
    description: string
    tags: string[]
    cell: string
}

export interface PolicySection {
    title: string
    body: string[]
}

export interface Topic {
    id: string
    label: string
    kind: 'error' | 'task' | 'build' | 'comparison'
    stacks: string[]
    contexts: string[]
}

export interface TopicMatrix {
    stacks: string[]
    contexts: string[]
    topics: Topic[]
}

export interface MatrixCell {
    key: string
    topic: Topic
    stack: string
    context: string
}

export interface PostIdea {
    cell: string
    slug: string
    title: string
    description: string
    tags: string[]
    angle: string
}

export interface PostQueue {
    generatedAt: string
    ideas: PostIdea[]
}

export interface MarkdownPage {
    slug: string
    body: string
}

export interface Product {
    name: string
    description: string
    icon: ImageMetadata
    href: string
    external?: boolean
}

export interface NavigationTab {
    name: string
    href: string
}

export interface OgImageProps {
    title: string
    description: string
}