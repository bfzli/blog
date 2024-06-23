import type { ComponentProps } from 'solid-js'

export type HeadingProps = ComponentProps<'h1'>

export type Props = {
    title: string
    description: string
    keywords: string
    image: string
    type: string
    date?: string
}