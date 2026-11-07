export interface Prayer { id: string; title: string; text: string; }

export const PRAYERS: Prayer[] = [
  { id: 'offering', title: 'Morning Offering', text: 'O Jesus, through the Immaculate Heart of Mary,\nI offer you my prayers, works, joys and sufferings of this day\nfor all the intentions of your Sacred Heart,\nin union with the Holy Sacrifice of the Mass throughout the world,\nfor the salvation of souls, the reparation of sins,\nthe reunion of all Christians,\nand in particular for the intentions of the Holy Father this month. Amen.' },
  { id: 'our-father', title: 'Our Father', text: 'Our Father, who art in heaven,\nhallowed be thy name;\nthy kingdom come,\nthy will be done on earth as it is in heaven.\nGive us this day our daily bread,\nand forgive us our trespasses,\nas we forgive those who trespass against us;\nand lead us not into temptation,\nbut deliver us from evil. Amen.' },
  { id: 'hail-mary', title: 'Hail Mary', text: 'Hail Mary, full of grace,\nthe Lord is with thee.\nBlessed art thou among women,\nand blessed is the fruit of thy womb, Jesus.\nHoly Mary, Mother of God,\npray for us sinners,\nnow and at the hour of our death. Amen.' },
  { id: 'glory-be', title: 'Glory Be', text: 'Glory be to the Father,\nand to the Son,\nand to the Holy Spirit,\nas it was in the beginning,\nis now, and ever shall be,\nworld without end. Amen.' },
  { id: 'teresa', title: "St. Teresa's Bookmark", text: 'Let nothing disturb you,\nlet nothing frighten you.\nAll things are passing;\nGod never changes.\nPatience obtains all things.\nWhoever has God lacks nothing;\nGod alone suffices.' },
  { id: 'anima-christi', title: 'Anima Christi', text: 'Soul of Christ, sanctify me.\nBody of Christ, save me.\nBlood of Christ, inebriate me.\nWater from the side of Christ, wash me.\nPassion of Christ, strengthen me.\nO good Jesus, hear me.\nWithin your wounds hide me.\nSuffer me not to be separated from you.\nFrom the malicious enemy defend me.\nIn the hour of my death call me\nand bid me come to you,\nthat with your saints I may praise you\nfor ever and ever. Amen.' },
  { id: 'st-michael', title: 'St. Michael', text: 'St. Michael the Archangel, defend us in battle.\nBe our protection against the wickedness and snares of the devil.\nMay God rebuke him, we humbly pray;\nand do thou, O Prince of the heavenly host,\nby the power of God, cast into hell Satan\nand all the evil spirits who prowl about the world\nseeking the ruin of souls. Amen.' },
];

export const RHYTHM = [
  { id: 'morning', title: 'Morning offering', hint: 'Give the day to God before email', when: 'Morning', prayer: 'offering' },
  { id: 'noon', title: 'The Angelus', hint: 'A one-minute pause at midday', when: 'Noon', prayer: undefined },
  { id: 'evening', title: 'Examen', hint: 'Look back on the day with gratitude', when: 'Evening', prayer: undefined },
] as const;
