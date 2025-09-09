// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import compressor from 'astro-compressor';
import icon from 'astro-icon';
import purgecss from 'astro-purgecss';
import { defineConfig } from 'astro/config';
import { serializeSitemapItem } from './src/utils/sitemap.js';

const WITH_PURGECSS = process.env.PURGE_CSS === 'true';

export default defineConfig({
    site: 'https://mikekey.com',
    integrations: [
        icon(),
        sitemap({
            filenameBase: 'sitemap',
            filter: (page) => !page.endsWith('/rss.xml'),
            customPages: [],
            serialize: serializeSitemapItem,
        }),
        ...(WITH_PURGECSS ? [purgecss()] : []),
        // Compress built assets to .br/.gz for optimal delivery
        compressor(),
    ],
    vite: {
        plugins: [tailwindcss()]
    },
    ...(WITH_PURGECSS ? { build: { inlineStylesheets: 'never' } } : {})
});
