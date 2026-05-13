import { createSignal, onMount, onCleanup, For, createEffect } from 'solid-js'
import type { NavigationProps } from '@/types'

const tabs = [
    { name: 'Posts', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Resume', href: '/resume' },
]

export const Navigation = (props: NavigationProps) => {
    const [path, setPath] = createSignal(props.currentPath)
    const [indicator, setIndicator] = createSignal({ left: 0, width: 0, ready: false })

    let containerRef: HTMLElement | undefined
    const tabRefs: Record<string, HTMLAnchorElement | undefined> = {}

    const isActive = (href: string) => {
        if (href === '/') return path() === '/'
        return path().startsWith(href)
    }

    const updateIndicator = () => {
        const active = tabs.find((t) => isActive(t.href))
        if (!active || !containerRef) return
        const el = tabRefs[active.href]
        if (!el) return
        const cRect = containerRef.getBoundingClientRect()
        const tRect = el.getBoundingClientRect()
        setIndicator({ left: tRect.left - cRect.left, width: tRect.width, ready: true })
    }

    onMount(() => {
        setPath(window.location.pathname)
        requestAnimationFrame(updateIndicator)

        const handleSwap = () => {
            setPath(window.location.pathname)
            requestAnimationFrame(updateIndicator)
        }

        const handleResize = () => updateIndicator()

        document.addEventListener('astro:after-swap', handleSwap)
        window.addEventListener('resize', handleResize)

        onCleanup(() => {
            document.removeEventListener('astro:after-swap', handleSwap)
            window.removeEventListener('resize', handleResize)
        })
    })

    createEffect(() => {
        path()
        requestAnimationFrame(updateIndicator)
    })

    return (
        <nav
            ref={(el) => (containerRef = el)}
            class='relative inline-flex items-center gap-1 p-1 rounded-full bg-elevate'
        >
            <span
                aria-hidden='true'
                class='absolute top-1 bottom-1 rounded-full bg-surface pointer-events-none'
                style={{
                    transform: `translateX(${indicator().left - 4}px)`,
                    width: `${indicator().width}px`,
                    opacity: indicator().ready ? '1' : '0',
                    transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), width 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease',
                }}
            />

            <For each={tabs}>
                {(tab) => (
                    <a
                        ref={(el) => (tabRefs[tab.href] = el)}
                        href={tab.href}
                        rel='prefetch'
                        aria-current={isActive(tab.href) ? 'page' : undefined}
                        classList={{
                            'relative z-10 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200': true,
                            'text-default cursor-pointer': isActive(tab.href),
                            'text-comment hover:text-default cursor-pointer': !isActive(tab.href),
                        }}
                    >
                        {tab.name}
                    </a>
                )}
            </For>
        </nav>
    )
}
