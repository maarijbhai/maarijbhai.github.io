import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title:      z.string(),
    blurb:      z.string().max(160),
    period:     z.string(),            // "Mar – Jun 2025"
    order:      z.number(),
    featured:   z.boolean().default(false),
    role:       z.string(),            // "Firmware and PCB design"
    domain:     z.enum(['hardware', 'embedded', 'software', 'ml', 'rf']),
    stack:      z.array(z.string()),
    keyResult:  z.string(),            // ONE measured outcome with a number
    hero:       image(),
    heroAlt:    z.string(),
    youtubeId:  z.string().optional(),
    repo:       z.string().url().optional(),
    demo:       z.string().url().optional(),
  }),
});

export const collections = { projects };
