import type { ComponentProps } from 'solid-js'

export type HeadingProps = ComponentProps<'h1'>

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
    icon: string
    url: string
}

export interface VibeCoding {
    slug: string
    name: string
    description: string
    longDescription: string
    icon: string
    url: string
    privacyPolicy: string
    tags: string[]
    actionText?: string
    actionIcon?: string
}

export interface NavigationProps {
    currentPath: string
}

export interface QueueItem {
    topic: string
    done: boolean
}

export interface GithubFileResponse {
    sha: string
    content: string
}