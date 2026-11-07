export type SectionId = 'believe' | 'explain' | 'live' | 'practices' | 'notes';

export interface Section {
  id: SectionId;
  name: string;
  tagline: string;
  /** Planned topics, taken from the book outline. Shown until articles exist. */
  planned: string[];
}

export const SECTIONS: Section[] = [
  {
    id: 'believe',
    name: 'Believe',
    tagline: 'Faith and reason, God, Christ, and the Church, for a skeptical age.',
    planned: [
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
    id: 'explain',
    name: 'Explain',
    tagline: 'The Creed in plain English, common questions, and the hard teachings.',
    planned: [
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
    id: 'live',
    name: 'Live',
    tagline: 'Practical guides for work, stress, difficult people, and getting back up.',
    planned: [
      "The Faith Doesn't Stay in the Pew",
      'Prayer in the Gaps',
      'Work as a Path to Holiness',
      'Peace in the Chaos',
      'Integrity Under Pressure',
      'Loving Difficult People',
      'Falling and Getting Up',
    ],
  },
  {
    id: 'practices',
    name: 'Practices',
    tagline: 'Morning offering, examen, Scripture habits, and Confession guides.',
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
