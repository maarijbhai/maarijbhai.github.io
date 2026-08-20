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
    domain:     z.enum(['hardware', 'digital-hardware', 'embedded', 'software', 'ml', 'rf']),
    stack:      z.array(z.string()),
    keyResult:  z.string(),            // ONE measured outcome with a number
    hero:       image(),
    heroAlt:    z.string(),
    heroFocus:  z.string().optional(),   // CSS object-position for the 16:9 crop, e.g. "center 65%"
    heroFit:    z.enum(['cover', 'contain']).default('cover'),  // "contain" letterboxes a non-16:9 image without cropping
    youtubeId:   z.string().optional(),
    videoLoop:   z.string().optional(),   // absolute path under /public, e.g. "/videos/foo.webm"
    videoAlt:    z.string().optional(),
    videoAsHero: z.boolean().default(false),  // if true, videoLoop replaces the hero image on the project page
    teamPhoto:   image().optional(),      // optional team/context photo shown in place of the video slot
    teamAlt:     z.string().optional(),
    teamCaption: z.string().optional(),
    repo:       z.string().url().optional(),
    demo:       z.string().url().optional(),
  }),
});

export const collections = { projects };
