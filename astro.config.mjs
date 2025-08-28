// @ts-check
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";
import compressor from 'astro-compressor';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import purgecss from 'astro-purgecss';
import { defineConfig } from 'astro/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WITH_PURGECSS = process.env.PURGE_CSS === 'true';

export default defineConfig({
    site: 'https://mikekey.com',
    integrations: [
        icon(),
        sitemap({
            filenameBase: 'sitemap',
            filter: (page) => !page.endsWith('/rss.xml'),
            customPages: [],
            serialize: async (item) => {
                const url = new URL(item.url);
                const pathname = url.pathname;
                const data = { ...item };

                if (pathname === '/') {
                    data.changefreq = 'daily';
                    data.priority = 1.0;
                } else if (pathname === '/blog/' || pathname === '/notes/') {
                    data.changefreq = 'daily';
                    data.priority = 0.9;
                } else if (pathname.startsWith('/blog/') || pathname.startsWith('/notes/')) {
                    data.changefreq = 'weekly';
                    data.priority = 0.7;
                } else if (pathname === '/about/' || pathname === '/now/') {
                    data.changefreq = 'monthly';
                    data.priority = 0.5;
                }

                const root = fileURLToPath(new URL('.', import.meta.url));
                const resolveContentPath = (p) => {
                    const trim = (s) => s.replace(/^\/+|\/+$/g, '');
                    if (p.startsWith('/blog/')) {
                        const id = trim(p.slice('/blog/'.length));
                        return path.join(root, 'src', 'content', 'blog', id + '.md');
                    }
                    if (p.startsWith('/notes/')) {
                        const id = trim(p.slice('/notes/'.length));
                        return path.join(root, 'src', 'content', 'notes', id + '.md');
                    }
                    if (p === '/about/' || p === '/about') {
                        return path.join(root, 'src', 'content', 'pages', 'about.md');
                    }
                    if (p === '/now/' || p === '/now') {
                        return path.join(root, 'src', 'content', 'pages', 'now.md');
                    }
                    return null;
                };

                const srcPath = resolveContentPath(pathname.endsWith('/') ? pathname : pathname + '/');
                let lastmod;
                if (srcPath) {
                    try {
                        const raw = await fs.readFile(srcPath, 'utf8');
                        const fm = raw.match(/^---\s*([\s\S]*?)\s*---/);
                        if (fm) {
                            const head = fm[1];
                            const get = (key) => {
                                const m = head.match(new RegExp(`(^|\n)${key}:\\s*['\"]?([^'\"\n]+)['\"]?`));
                                return m ? m[2].trim() : null;
                            };
                            const ud = get('updatedDate');
                            const d = get('date');
                            const dt = (ud && !Number.isNaN(Date.parse(ud))) ? new Date(ud) : (d && !Number.isNaN(Date.parse(d)) ? new Date(d) : null);
                            if (dt) lastmod = dt.toISOString();
                        }
                        if (!lastmod) {
                            // fallback to file mtime
                            const st = await fs.stat(srcPath);
                            lastmod = new Date(st.mtimeMs).toISOString();
                        }
                    } catch {
                        // ignore
                    }
                }
                data.lastmod = lastmod ?? new Date().toISOString();
                return data;
            },
        }),
        pagefind(),
        ...(WITH_PURGECSS ? [purgecss()] : []),
        // Compress built assets to .br/.gz for optimal delivery
        compressor(),
    ],
    vite: {
        plugins: [tailwindcss()]
    },
    ...(WITH_PURGECSS ? { build: { inlineStylesheets: 'never' } } : {})
});
