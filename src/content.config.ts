import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Teachers of the faith: Doctors of the Church, other saints, and theologians.
 * (The collection keeps its original name, `doctors`, so article references still work.)
 * A Doctor is anyone with a `proclaimed` year, and always counts as a saint and a theologian.
 * See src/data/teachers.ts.
 */
const doctors = defineCollection({
  loader: file('src/data/doctors.json'),
  schema: ({ image }) => z.object({
    name: z.string(),
    /** `era0` is the figures of Scripture, shown in the timeline's Old and New Testament parts. */
    era: z.enum(['era0', 'era1', 'era2', 'era3', 'era4']),
    /** Year of death, used for ordering. Negative for BC; approximate for figures of Scripture. */
    died: z.number().int(),
    /** Shown in place of `died` when the year is uncertain, e.g. "c. 1250 BC" or "1st century". */
    dates: z.string().optional(),
    /** Label for the date, when "Died" doesn't fit (Mary's Assumption, Elijah taken up). */
    datesLabel: z.string().optional(),
    /** Shown on its own above the section's cards, and first in the previous/next order. Used for Christ. */
    featured: z.boolean().default(false),
    /** The year the Church proclaimed them a Doctor. Leave out for anyone who isn't one. */
    proclaimed: z.number().int().optional(),
    /** Canonized. Implied for Doctors. */
    saint: z.boolean().default(false),
    /** Known for theological writing or teaching. Implied for Doctors. */
    theologian: z.boolean().default(false),
    role: z.string(),
    title: z.string().optional(),
    summary: z.string(),
    woman: z.boolean().default(false),
    lay: z.boolean().default(false),
    /**
     * One-page printable. `image` is the original in src/assets/printables/ (path relative to
     * doctors.json); Astro makes small web versions of it for the page. `download` is the
     * print-quality file in public/printables/ that visitors download.
     */
    printable: z.object({
      image: image(),
      download: z.string().startsWith('/printables/'),
      alt: z.string(),
    }).optional(),
    /** Online sources for their writings, shown next to the printable. */
    resources: z.array(z.object({
      title: z.string(),
      url: z.url({ protocol: /^https$/ }),
      /** The site it's on, such as "Project Gutenberg". */
      source: z.string(),
      note: z.string().optional(),
    })).default([]),
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

/** Daily Mass readings, written each morning by scripts/daily-readings.ts. Citations and a summary only. */
const readings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/readings' }),
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    title: z.string(),
    url: z.string().startsWith('https://'),
    readings: z.array(z.object({
      label: z.string(),
      citation: z.string(),
      /** An optional alternative reading, often a shorter form. */
      alt: z.string().optional(),
    })).min(1),
    summary: z.string().min(20).max(600),
  }),
});

export const collections = { doctors, articles, readings };
