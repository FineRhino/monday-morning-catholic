/** Web sites listed in the Resources page's Web Sites section, in the order shown. */
export interface Website { name: string; url: string; description: string; }

export const WEBSITES: Website[] = [
  {
    name: 'Catholic Answers',
    url: 'https://www.catholic.com/',
    description: 'Apologetics and plain answers to common questions about the Catholic faith.',
  },
  {
    name: 'The Holy See',
    url: 'https://www.vatican.va/content/vatican/en.html',
    description: "The Vatican's official site: papal documents, the Catechism, and Church teaching.",
  },
  {
    name: 'New Advent',
    url: 'https://www.newadvent.org/',
    description: 'The Catholic Encyclopedia, writings of the Church Fathers, the Summa Theologica, and the Bible.',
  },
];
