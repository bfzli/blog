import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
    content: ['src/**/*.{astro,md,mdx,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                default: 'var(--default)',
                primary: 'var(--primary)',
                neutral: 'var(--neutral)',
                surface: 'var(--surface)',
                elevate: 'var(--elevate)',
                element: 'var(--element)',
                comment: 'var(--comment)',
                post: 'var(--post)',
                muted: 'var(--muted)',
                soft: 'var(--soft)',
                subtle: 'var(--subtle)',
                'primary-hover': 'var(--primary-hover)',
                'post-hover': 'var(--post-hover)',
                'icon-secondary': 'var(--icon-secondary)',
                pill: 'var(--pill)'
            },
            fontFamily: {
                sans: ['DM Sans', 'DM Sans Fallback', ...fontFamily.sans],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
            },
            minHeight: {
                xs: '18rem',
                sm: '32rem',
                md: '42rem',
                lg: '54rem',
            },
        },
    },
    plugins: []
} satisfies Config
