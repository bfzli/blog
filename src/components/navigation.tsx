import { createSignal, onMount, onCleanup, For } from 'solid-js'
import type { NavigationProps } from '@/types'

const tabs = [
    { name: 'Posts', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Resume', href: '/resume' },
]

export const Navigation = (props: NavigationProps) => {
    const [path, setPath] = createSignal(props.currentPath)

    onMount(() => {
        setPath(window.location.pathname)

        const handleSwap = () => {
            setPath(window.location.pathname)
        }

        document.addEventListener('astro:after-swap', handleSwap)

        onCleanup(() => {
            document.removeEventListener('astro:after-swap', handleSwap)
        })
    })

    const isActive = (href: string) => {
        if (href === '/') {
            return path() === '/'
        }
        return path().startsWith(href)
    }

    return (
        <nav class='inline-flex items-center gap-1 p-1 rounded-lg bg-elevate'>
            <For each={tabs}>
                {(tab) => (
                    <a
                        href={tab.href}
                        rel='prefetch'
                        aria-current={isActive(tab.href) ? 'page' : undefined}
                        classList={{
                            'px-3 py-1 rounded-md text-sm font-medium transition-all ease-in-out duration-200': true,
                            'bg-surface text-default cursor-default': isActive(tab.href),
                            'text-comment hover:bg-white/40': !isActive(tab.href),
                        }}
                    >
                        {tab.name}
                    </a>
                )}
            </For>
        </nav>
    )
}

