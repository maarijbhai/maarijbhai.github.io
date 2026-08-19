import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const STATIC_PATHS = ['/', '/about/', '/projects/', '/cv/', '/contact/'];

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('astro.config.mjs must define `site` for the sitemap to build.');
  }

  const projects = await getCollection('projects');
  const projectPaths = projects.map((p) => `/projects/${p.id}/`);
  const paths = [...STATIC_PATHS, ...projectPaths];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths
      .map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`)
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
