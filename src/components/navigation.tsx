import { createSignal, onMount, onCleanup, For, Show } from 'solid-js'
import type { NavigationProps } from '@/types'

const tabs = [
    { name: 'Posts', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Resume', href: '/resume' }
]

export const Navigation = (props: NavigationProps) => {
    const [path, setPath] = createSignal(props.currentPath)
    const [indicator, setIndicator] = createSignal<{
        left: number
        width: number
    } | null>(null)
    const [animate, setAnimate] = createSignal(false)

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
        setIndicator({ left: tRect.left - cRect.left, width: tRect.width })
    }

    onMount(() => {
        setPath(window.location.pathname)
        updateIndicator()

        const handleSwap = () => {
            setAnimate(true)
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

    return (
        <nav
            ref={(el) => (containerRef = el)}
            class='relative inline-flex items-center gap-1 rounded-full bg-elevate p-1'
        >
            <Show when={indicator()}>
                {(ind) => (
                    <span
                        aria-hidden='true'
                        class='pointer-events-none absolute bottom-1 top-1 rounded-full bg-surface'
                        style={{
                            transform: `translateX(${ind().left - 4}px)`,
                            width: `${ind().width}px`,
                            transition: animate()
                                ? 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), width 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
                                : 'none'
                        }}
                    />
                )}
            </Show>

            <For each={tabs}>
                {(tab) => (
                    <a
                        ref={(el) => (tabRefs[tab.href] = el)}
                        href={tab.href}
                        rel='prefetch'
                        aria-current={isActive(tab.href) ? 'page' : undefined}
                        aria-disabled={isActive(tab.href) ? 'true' : undefined}
                        classList={{
                            'relative z-10 px-3 py-1 rounded-full text-sm font-medium transition-hover': true,
                            'text-default pointer-events-none': isActive(
                                tab.href
                            ),
                            'text-comment hover:bg-post cursor-pointer':
                                !isActive(tab.href)
                        }}
                    >
                        {tab.name}
                    </a>
                )}
            </For>
        </nav>
    )
}