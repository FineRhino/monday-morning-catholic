export type SectionId = 'believe' | 'explain' | 'live' | 'practices' | 'notes';

export interface Section {
  id: SectionId;
  name: string;
  tagline: string;
  /**
   * Planned topics, shown publicly until articles exist. The book outline for Believe,
   * Explain, and Live is private and lives in book.ts instead.
   */
  planned: string[];
}

export const SECTIONS: Section[] = [
  {
    id: 'believe',
    name: 'Believe',
    tagline: 'Faith and reason, God, Christ, and the Church, for a skeptical age.',
    planned: [],
  },
  {
    id: 'explain',
    name: 'Explain',
    tagline: 'The Creed in plain English, common questions, and the hard teachings.',
    planned: [],
  },
  {
    id: 'live',
    name: 'Live',
    tagline: 'Practical guides for work, stress, difficult people, and getting back up.',
    planned: [],
  },
  {
    id: 'practices',
    name: 'Practices and Prayers',
    tagline: 'Morning offering, examen, Scripture habits, Confession guides, and traditional prayers.',
    planned: ['The Morning Offering', 'The Daily Examen', 'A Five-Minute Scripture Habit', 'Preparing for Confession', 'The Angelus'],
  },
  {
    id: 'notes',
    name: 'Notes',
    tagline: 'Personal reflections from a layman working it out day by day.',
    planned: [],
  },
];

export const sectionById = (id: string) => SECTIONS.find((s) => s.id === id);
