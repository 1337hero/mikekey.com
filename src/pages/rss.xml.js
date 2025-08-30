import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	const notes = await getCollection('notes');

	// very small helper to strip basic Markdown formatting for descriptions
	const stripMarkdown = (md = '') =>
		md
			.replace(/```[\s\S]*?```/g, '') // code blocks
			.replace(/`([^`]*)`/g, '$1')
			.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // links
			.replace(/[*_~>#-]/g, '')
			.trim();

	const items = [
		...posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			link: `/blog/${post.id}/`,
			pubDate: post.data.updatedDate ?? post.data.date,
		})),
		...notes.map((note) => ({
			title: 'Quick note',
			description: note.data.description ?? stripMarkdown(note.body),
			link: `/blog/#note-${note.id.replace(/\//g, '-')}`,
			pubDate: note.data.updatedDate ?? note.data.date,
		})),
	].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}
