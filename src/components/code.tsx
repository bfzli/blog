import { ComponentProps, Show } from 'solid-js'

export const Code = (props: ComponentProps<'code'>) => {
    const language = () => props.class?.match(/language-([\w-]+)/)?.[1] ?? 'code'

    return (
        <Show
            when={props.class?.includes('language-')}
            fallback={
                <code {...props} class='inline-code'>
                    {props.children}
                </code>
            }
        >
            <div class='group relative my-7' data-code-block>
                <div
                    class='flex items-center justify-between rounded-t-xl border border-b-0 border-elevate bg-element px-4 py-2'
                >
                    <span
                        class='text-[11px] font-medium uppercase tracking-wider text-soft'
                    >
                        {language()}
                    </span>

                    <button
                        type='button'
                        aria-label='Copy code'
                        class='copy-code rounded-md px-2 py-0.5 text-[11px] font-medium text-soft opacity-0 transition-opacity hover:text-default focus:opacity-100 group-hover:opacity-100'
                    >
                        Copy
                    </button>
                </div>

                <code
                    {...props}
                    class='grid overflow-x-auto rounded-b-xl border border-elevate bg-neutral p-5 text-sm font-normal leading-relaxed'
                >
                    {props.children}
                </code>
            </div>
        </Show>
    )
}