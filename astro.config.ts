import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
import prism from 'rehype-prism-plus'
import partytown from '@astrojs/partytown'

import { defineConfig } from 'astro/config'

export default defineConfig({
    site: 'https://bfzli.com',
    output: 'hybrid',
    adapter: vercel(),
    vite: { resolve: { alias: { '@': '/src' } } },
    prefetch: { prefetchAll: true },
    markdown: { 
        syntaxHighlight: false, 
        rehypePlugins: [prism] 
    },
    integrations: [
        mdx(), 
        sitemap(), 
        solid(), 
        tailwind(),
        partytown({
			config: {
			  forward: ["dataLayer.push"],
			},
		})
    ],
})
