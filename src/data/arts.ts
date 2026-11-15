/**
 * The Music, Art and Literature page (/arts/): the saints on music, musicians, artists, and writers.
 * Every quote here was checked against its source; keep the citation with any new one.
 */
import type { ImageMetadata } from 'astro';
import fraAngelico from '../assets/arts/fra-angelico-annunciation.jpg';
import michelangelo from '../assets/arts/michelangelo-creation-of-adam.jpg';
import dante from '../assets/arts/dante-botticelli.jpg';
import chesterton from '../assets/arts/chesterton.jpg';

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
/** A musician tile. The picture is the thumbnail of their featured YouTube video. */
export interface Musician {
  name: string;
  /** One line on who they are and what their music sounds like. */
  about: string;
  /** The YouTube video whose thumbnail is the tile's picture. The picture links to it. */
  featured: { title: string; videoId: string };
  links: ArtistLink[];
}

export const MUSICIANS: Musician[] = [
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

/**
 * A visual artist or writer tile. `image` is a public-domain picture saved in src/assets/arts/
 * (a work by the artist, or a portrait of the writer); `credit` links to where it came from.
 */
export interface Maker {
  name: string;
  /** Life dates, e.g. "c. 1395–1455". */
  years: string;
  about: string;
  image: ImageMetadata;
  imageAlt: string;
  credit: { label: string; url: string };
  links: ArtistLink[];
}

export const ARTISTS: Maker[] = [
  {
    name: 'Fra Angelico',
    years: 'c. 1395–1455',
    about: 'A Dominican friar and painter, beatified by John Paul II in 1982 and named patron of artists. He painted his frescoes at San Marco in Florence for the friars to pray with.',
    image: fraAngelico,
    imageAlt: 'The Annunciation by Fra Angelico: the angel Gabriel kneels before Mary under a loggia.',
    credit: { label: 'The Annunciation, San Marco, Florence', url: 'https://commons.wikimedia.org/wiki/File:Fra_Angelico_043.jpg' },
    links: [
      { label: 'His frescoes in the Niccoline Chapel', url: 'https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/cappella-niccolina.html' },
      { label: 'Gallery of his works', url: 'https://commons.wikimedia.org/wiki/Category:Fra_Angelico' },
    ],
  },
  {
    name: 'Michelangelo',
    years: '1475–1564',
    about: "Painted the Sistine Chapel ceiling and The Last Judgment, carved the Pietà in St. Peter's, and designed the basilica's dome.",
    image: michelangelo,
    imageAlt: 'The Creation of Adam by Michelangelo: God reaches out to touch the hand of Adam.',
    credit: { label: 'The Creation of Adam, Sistine Chapel', url: 'https://commons.wikimedia.org/wiki/File:Michelangelo_-_Creation_of_Adam_(cropped).jpg' },
    links: [
      { label: 'The Sistine Chapel', url: 'https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/cappella-sistina.html' },
      { label: 'Gallery of his works', url: 'https://commons.wikimedia.org/wiki/Category:Michelangelo_Buonarroti' },
    ],
  },
];

export const WRITERS: Maker[] = [
  {
    name: 'Dante Alighieri',
    years: '1265–1321',
    about: 'His Divine Comedy follows a soul from hell through purgatory to heaven, guided by Virgil and Beatrice. Popes Benedict XV and Francis each wrote a letter in his honor.',
    image: dante,
    imageAlt: 'Portrait of Dante by Botticelli, in profile, wearing a red hood and a laurel wreath.',
    credit: { label: 'Portrait by Sandro Botticelli', url: 'https://commons.wikimedia.org/wiki/File:Portrait_de_Dante.jpg' },
    links: [
      { label: "The Divine Comedy (Longfellow's translation)", url: 'https://www.gutenberg.org/ebooks/1004' },
      { label: 'In Praeclara Summorum (Benedict XV, 1921)', url: 'https://www.vatican.va/content/benedict-xv/en/encyclicals/documents/hf_ben-xv_enc_30041921_in-praeclara-summorum.html' },
      { label: 'Candor Lucis Aeternae (Francis, 2021)', url: 'https://www.vatican.va/content/francesco/en/apost_letters/documents/papa-francesco-lettera-ap_20210325_centenario-dante.html' },
    ],
  },
  {
    name: 'G. K. Chesterton',
    years: '1874–1936',
    about: 'Journalist, poet, and novelist who became Catholic in 1922. Orthodoxy, The Everlasting Man, and the Father Brown mysteries defend the faith with wit.',
    image: chesterton,
    imageAlt: 'Photograph of G. K. Chesterton wearing pince-nez glasses.',
    credit: { label: 'Photograph, Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Gilbert_Chesterton.jpg' },
    links: [
      { label: 'Orthodoxy', url: 'https://www.gutenberg.org/ebooks/130' },
      { label: 'The Everlasting Man', url: 'https://www.gutenberg.org/ebooks/65688' },
      { label: 'The Innocence of Father Brown', url: 'https://www.gutenberg.org/ebooks/204' },
      { label: 'All his books on Project Gutenberg', url: 'https://www.gutenberg.org/ebooks/author/80' },
    ],
  },
];
