import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import cloudflare from '@astrojs/cloudflare'
import prism from 'rehype-prism-plus'
import partytown from '@astrojs/partytown'

import { defineConfig } from 'astro/config'

const SITE_URL = 'https://bfzli.com'

export default defineConfig({
    site: SITE_URL,
    trailingSlash: 'never',
    adapter: cloudflare(),
    vite: { resolve: { alias: { '@': '/src' } } },
    prefetch: { defaultStrategy: 'hover' },
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
