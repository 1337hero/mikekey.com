import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Load Markdown files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			// Transform string to Date object
			date: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});


const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			date: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

// collections are exported at the bottom

// Quick notes collection for feed/index-only items
const notes = defineCollection({
    loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
    schema: () =>
        z.object({
            // minimal frontmatter for a quick note
            date: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            // optional short summary for RSS description
            description: z.string().optional(),
        }),
});

// Re-export including notes (Astro uses the last export)
export const collections = { blog, pages, notes };
