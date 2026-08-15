import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import { refractor } from 'refractor/all'
import prism from 'rehype-prism-plus/generator'
import partytown from '@astrojs/partytown'
import { defineConfig } from 'astro/config'

// Refractor ships no Svelte, Vue or Astro grammar, so highlight those as markup.
refractor.alias({ markup: ['svelte', 'vue', 'astro'] })

export default defineConfig({
    devToolbar: { enabled: false },
    site: 'https://bfzli.com',
    trailingSlash: 'never',
    output: 'static',
    build: { format: 'file' },
    vite: { resolve: { alias: { '@': '/src' } } },
    prefetch: { defaultStrategy: 'hover' },
    // ignoreMissing keeps an unknown fence language from aborting the build.
    markdown: {
        syntaxHighlight: false,
        rehypePlugins: [[prism(refractor), { ignoreMissing: true }]]
    },
    integrations: [mdx(), sitemap(), solid(), tailwind(), partytown({ config: { forward: ['dataLayer.push'] } })],
})
