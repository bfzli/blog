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

export interface Skill {
    name: string
    icon: string
}

export interface Product {
    name: string
    description: string
    icon: ImageMetadata
    href: string
    external?: boolean
}

export interface NavigationProps {
    currentPath: string
}

export interface OgImageProps {
    title: string
    description: string
}