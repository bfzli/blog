import { ComponentProps, Show } from 'solid-js'

export const Code = (props: ComponentProps<'code'>) => {
    return (
        <Show
            when={props.class?.includes('language-')}
            fallback={
                <code {...props} class='rounded border border-elevate bg-element px-1.5 py-0.5'>
                    {props.children}
                </code>
            }
        >

            <div class='group relative'>
                <button type='button' aria-label='Copy code' class='copy-code absolute right-2 top-2 z-10 rounded-sm bg-elevate px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity'>
                    Copy
                </button>

                <code {...props} class='my-7 grid overflow-x-scroll rounded border border-elevate bg-neutral p-5 pr-6 text-sm font-medium leading-normal'>
                    {props.children}
                </code>
            </div>
        </Show>
    )
}
