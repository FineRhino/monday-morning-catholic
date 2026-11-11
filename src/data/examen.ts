/** The daily Examen, following the five points St. Ignatius gives in the Spiritual Exercises (no. 43). */
export interface ExamenStep {
  title: string;
  /** What to do in this step, in a few sentences. */
  guide: string;
  /** Questions to sit with. */
  questions: string[];
  /** A short prayer to close the step. */
  prayer: string;
}

export const EXAMEN_STEPS: ExamenStep[] = [
  {
    title: "Become aware of God's presence",
    guide: 'Find a quiet place and settle into stillness. Take a few slow breaths. God has been with you all day, and he is with you now. Ask the Holy Spirit for light to see your day the way he sees it.',
    questions: ['Can I let go of the noise of the day for these few minutes?', 'Do I believe God is here with me, right now?'],
    prayer: 'Come, Holy Spirit. Help me see this day with your eyes.',
  },
  {
    title: 'Give thanks',
    guide: 'Look back over the day for its gifts, large and small: a person, a conversation, a meal, a moment of beauty, rest, or relief. Name two or three of them, and thank God for each one.',
    questions: ['What am I most grateful for today?', 'Who was a gift to me today?', 'What small thing would I have missed if I had not stopped to look?'],
    prayer: 'Thank you, Lord, for every good gift you gave me today.',
  },
  {
    title: 'Review the day',
    guide: 'Walk back through the day from waking until now, like watching a film. Notice the moments when you felt close to God, at peace, or fully alive, and the moments when you felt restless, anxious, or far from him. For now, just notice. There is no need to judge yet.',
    questions: ['When did I feel most alive or at peace today?', 'When did I feel drained, anxious, or far from God?', 'Where did I see God at work, in me or in someone else?'],
    prayer: 'Lord, show me where you were with me today, even when I did not notice.',
  },
  {
    title: 'Ask for forgiveness',
    guide: 'Let the Holy Spirit bring to mind a moment when you fell short: an impatient word, a chance to help that you passed by, a time you put yourself first. Tell God about it honestly, without excuses and without despair, and ask for his mercy. For serious sin, bring it to Confession.',
    questions: ['Where did I fail to love God or the people around me today?', 'Is there someone I need to apologize to, or forgive?'],
    prayer: 'Lord Jesus Christ, Son of God, have mercy on me, a sinner.',
  },
  {
    title: 'Look toward tomorrow',
    guide: 'Turn to tomorrow. What is coming: a meeting, a hard conversation, a person who needs you? Ask God for the grace you will need, and choose one small, concrete way to love better tomorrow.',
    questions: ['What do I need from God tomorrow?', 'What is one small thing I will do differently?'],
    prayer: 'Lord, I place tomorrow in your hands. Give me the grace to follow you in it.',
  },
];
