import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const doctors = defineCollection({
  loader: file('src/data/doctors.json'),
  schema: z.object({
    name: z.string(),
    era: z.enum(['era1', 'era2', 'era3', 'era4']),
    died: z.number().int(),
    proclaimed: z.number().int(),
    role: z.string(),
    title: z.string().optional(),
    summary: z.string(),
    woman: z.boolean().default(false),
    lay: z.boolean().default(false),
    /** One-page printable stored in public/printables/; width and height are in pixels. */
    printable: z.object({
      src: z.string(),
      width: z.number().int(),
      height: z.number().int(),
      alt: z.string(),
    }).optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['believe', 'explain', 'live', 'practices', 'notes']),
    date: z.coerce.date(),
    /** Doctors of the Church this article draws on; links to their pages. */
    doctors: z.array(reference('doctors')).default([]),
    /** Catechism of the Catholic Church paragraph numbers. */
    ccc: z.array(z.number().int().min(1).max(2865)).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { doctors, articles };
