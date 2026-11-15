/**
 * The Music page: saints on music, and tiles of Catholic and Christian artists.
 * Every quote here was checked against its source; keep the citation with any new one.
 */

export interface MusicQuote { text: string; who: string; source: string; }

export const MUSIC_QUOTES: MusicQuote[] = [
  {
    text: 'How did I weep, in Thy Hymns and Canticles, touched to the quick by the voices of Thy sweet-attuned Church! The voices flowed into mine ears, and the Truth distilled into my heart, whence the affections of my devotion overflowed, and tears ran down, and happy was I therein.',
    who: 'St. Augustine',
    source: 'Confessions IX.6 (trans. E. B. Pusey)',
  },
  {
    text: 'Singing is for one who loves.',
    who: 'St. Augustine',
    source: 'Sermon 336 (“Cantare amantis est”)',
  },
  {
    text: "It is evident that the human soul is moved in various ways according to various melodies of sound… Hence the use of music in the divine praises is a salutary institution, that the souls of the faint-hearted may be the more incited to devotion.",
    who: 'St. Thomas Aquinas',
    source: 'Summa Theologiae II-II, q. 91, a. 2',
  },
  {
    text: 'Sacred music, being a complementary part of the solemn liturgy, participates in the general scope of the liturgy, which is the glory of God and the sanctification and edification of the faithful.',
    who: 'Pope St. Pius X',
    source: 'Tra le sollecitudini, 1 (1903)',
  },
];

export interface ArtistLink { label: string; url: string; }
export interface Artist {
  name: string;
  /** One line on who they are and what their music sounds like. */
  about: string;
  /** The YouTube video whose thumbnail is the tile's picture. The picture links to it. */
  featured: { title: string; videoId: string };
  links: ArtistLink[];
}

export const ARTISTS: Artist[] = [
  {
    name: 'Brother Isaiah',
    about: 'Fr. Isaiah Marie Hofmann, a Franciscan Friar of the Renewal, writes acoustic songs of prayer with touches of folk and reggae.',
    featured: { title: "Receive Me (I'm Yours)", videoId: '-mfFn97Jr7s' },
    links: [
      { label: 'His music on YouTube', url: 'https://www.youtube.com/channel/UCX5eRM3nz1I2yDygOFfX4bg' },
      { label: "Receive Me (I'm Yours)", url: 'https://www.youtube.com/watch?v=-mfFn97Jr7s' },
      { label: "Jacob's Song", url: 'https://www.youtube.com/watch?v=k9WFac5WEDg' },
      { label: 'Blindman', url: 'https://www.youtube.com/watch?v=Sp8fmikcztg' },
    ],
  },
  {
    name: 'Fr. Tansi',
    about: 'Fr. Tansi Ibisi, a Franciscan Friar of the Renewal, blends folk with African music.',
    featured: { title: 'Nani Chineke', videoId: 'z85yb8GZmVI' },
    links: [
      { label: 'Franciscan Friars of the Renewal on YouTube', url: 'https://www.youtube.com/@cfr_franciscans' },
      { label: 'Nani Chineke', url: 'https://www.youtube.com/watch?v=z85yb8GZmVI' },
      { label: 'Rising', url: 'https://www.youtube.com/watch?v=RZx35DP0WHc' },
    ],
  },
];
