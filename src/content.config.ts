import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const contentSchema = ({ image }: { image: any }) => z.object({
	title: z.string(),
	description: z.string().optional(),
	date: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	heroImage: image().optional(),
});

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
	schema: contentSchema,
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
	schema: contentSchema,
});

const notes = defineCollection({
	loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
	schema: () => z.object({
		date: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		description: z.string().optional(),
	}),
});

export const collections = { blog, pages, notes };
