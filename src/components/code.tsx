import { ComponentProps, Show } from 'solid-js'

export const Code = (props: ComponentProps<'code'>) => {
    return (
        <Show
            when={props.class?.includes('language-')}
            fallback={
                <code
                    {...props}
                    class='rounded-md border border-elevate bg-element px-1.5 py-0.5'
                >
                    {props.children}
                </code>
            }
        >
            <div class='group relative'>
                <button
                    type='button'
                    aria-label='Copy code'
                    class='copy-code absolute right-3 top-3 z-10 rounded-md border border-elevate bg-surface px-2.5 py-1 text-xs font-medium text-soft opacity-0 transition-opacity hover:text-default focus:opacity-100 group-hover:opacity-100'
                >
                    Copy
                </button>

                <code
                    {...props}
                    class='my-7 grid overflow-x-scroll rounded-xl border border-elevate bg-neutral p-5 pr-6 text-sm font-normal leading-relaxed'
                >
                    {props.children}
                </code>
            </div>
        </Show>
    )
}