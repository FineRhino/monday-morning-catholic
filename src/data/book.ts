import type { SectionId } from './sections';

/**
 * The book outline. Used only by the private notes pages under /account/notes/, which
 * Cloudflare Access restricts to the site owner. Don't import this into a public page.
 */
export interface BookPart { section: SectionId; chapters: string[]; }

export const BOOK_PARTS: BookPart[] = [
  {
    section: 'believe',
    chapters: [
      'The Air We Breathe',
      'Is Anybody There?',
      "Faith and Reason Aren't Enemies",
      'Who Do You Say That I Am?',
      'Why Trust the Church?',
      'When God Is Silent',
      'Choosing to Believe',
    ],
  },
  {
    section: 'explain',
    chapters: [
      'Why Bother Explaining?',
      'My Story First',
      'The Creed in Plain English',
      'Why Catholic, Not Just Christian?',
      "The Questions You'll Actually Get",
      'The Hard Teachings',
      'Conversations, Not Arguments',
    ],
  },
  {
    section: 'live',
    chapters: [
      "The Faith Doesn't Stay in the Pew",
      'Prayer in the Gaps',
      'Work as a Path to Holiness',
      'Peace in the Chaos',
      'Integrity Under Pressure',
      'Loving Difficult People',
      'Falling and Getting Up',
    ],
  },
];

export const BOOK_SECTIONS = new Set<string>(BOOK_PARTS.map((p) => p.section));
