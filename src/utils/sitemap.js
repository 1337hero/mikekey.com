import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));

function resolveContentPath(pathname) {
    const trim = (s) => s.replace(/^\/+|\/+$/g, '');
    
    if (pathname.startsWith('/blog/')) {
        const id = trim(pathname.slice('/blog/'.length));
        return path.join(root, 'src', 'content', 'blog', id + '.md');
    }
    
    if (pathname === '/about/' || pathname === '/about') {
        return path.join(root, 'src', 'content', 'pages', 'about.md');
    }
    
    if (pathname === '/now/' || pathname === '/now') {
        return path.join(root, 'src', 'content', 'pages', 'now.md');
    }
    
    return null;
}

async function getLastModifiedDate(srcPath) {
    try {
        const raw = await fs.readFile(srcPath, 'utf8');
        const frontmatterMatch = raw.match(/^---\s*([\s\S]*?)\s*---/);
        
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const getValue = (key) => {
                const match = frontmatter.match(new RegExp(`(^|\n)${key}:\\s*['\"]?([^'\"\n]+)['\"]?`));
                return match ? match[2].trim() : null;
            };
            
            const updatedDate = getValue('updatedDate');
            const date = getValue('date');
            
            const parsedDate = (updatedDate && !Number.isNaN(Date.parse(updatedDate))) 
                ? new Date(updatedDate) 
                : (date && !Number.isNaN(Date.parse(date)) ? new Date(date) : null);
                
            if (parsedDate) return parsedDate.toISOString();
        }
        
        const stats = await fs.stat(srcPath);
        return new Date(stats.mtimeMs).toISOString();
    } catch {
        return null;
    }
}

export async function serializeSitemapItem(item) {
    const url = new URL(item.url);
    const pathname = url.pathname;
    const data = { ...item };
    
    if (pathname === '/') {
        data.changefreq = 'daily';
        data.priority = 1.0;
    } else if (pathname === '/blog/') {
        data.changefreq = 'daily';
        data.priority = 0.9;
    } else if (pathname.startsWith('/blog/')) {
        data.changefreq = 'weekly';
        data.priority = 0.7;
    } else if (pathname === '/about/' || pathname === '/now/') {
        data.changefreq = 'monthly';
        data.priority = 0.5;
    }
    
    const normalizedPath = pathname.endsWith('/') ? pathname : pathname + '/';
    const srcPath = resolveContentPath(normalizedPath);
    
    if (srcPath) {
        const lastmod = await getLastModifiedDate(srcPath);
        data.lastmod = lastmod ?? new Date().toISOString();
    } else {
        data.lastmod = new Date().toISOString();
    }
    
    return data;
}