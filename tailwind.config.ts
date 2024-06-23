import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
    content: ['src/**/*.{astro,md,mdx,js,ts,jsx,tsx}'],
    darkMode: 'media',
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
                post: 'var(--post)'
            },
            fontFamily: {
                sans: ['Space Grostek', ...fontFamily.mono],
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
