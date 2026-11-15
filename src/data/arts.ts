/**
 * The Music, Art and Literature page (/arts/): the saints on music, musicians, artists, and writers.
 * Every quote here was checked against its source; keep the citation with any new one.
 */
import type { ImageMetadata } from 'astro';
import fraAngelico from '../assets/arts/fra-angelico-annunciation.jpg';
import michelangelo from '../assets/arts/michelangelo-creation-of-adam.jpg';
import dante from '../assets/arts/dante-botticelli.jpg';
import chesterton from '../assets/arts/chesterton.jpg';
import augustineImg from '../assets/arts/augustine.jpg';
import hildegardImg from '../assets/arts/hildegard.jpg';
import catherineOfSienaImg from '../assets/arts/catherine-of-siena.jpg';
import teresaOfAvilaImg from '../assets/arts/teresa-of-avila.jpg';
import johnOfTheCrossImg from '../assets/arts/john-of-the-cross.jpg';
import newmanImg from '../assets/arts/newman.jpg';
import hopkinsImg from '../assets/arts/hopkins.jpg';
import tolkienImg from '../assets/arts/tolkien.jpg';
import undsetImg from '../assets/arts/undset.jpg';
import bernanosImg from '../assets/arts/bernanos.jpg';
import oconnorImg from '../assets/arts/oconnor.jpg';
import percyImg from '../assets/arts/percy.jpg';
import waughImg from '../assets/arts/waugh.jpg';
import mauriacImg from '../assets/arts/mauriac.jpg';

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
  /** Where the image came from. `license` defaults to "public domain". */
  credit: { label: string; url: string; license?: string };
  /** CSS object-position for the crop, when the default (top-weighted) cuts off a face. */
  focus?: string;
  /**
   * For portraits too tightly framed to crop: show the whole picture, with the bands beside it
   * filled in this color (match the photo's background).
   */
  contain?: string;
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

/** Writers, in order of birth. Saints who are Doctors also link to their page on this site. */
export const WRITERS: Maker[] = [
  {
    name: "St. Augustine",
    years: "354–430",
    about: "Bishop of Hippo. His Confessions, the first great spiritual autobiography, and The City of God have shaped Western thought for sixteen centuries.",
    image: augustineImg,
    imageAlt: "Saint Augustine at his desk with a pen and a flaming heart, by Philippe de Champaigne.",
    credit: { label: "Painting by Philippe de Champaigne", url: "https://commons.wikimedia.org/wiki/File:Saint_Augustine_by_Philippe_de_Champaigne.jpg" },
    links: [
      { label: "Confessions", url: "https://www.gutenberg.org/ebooks/3296" },
      { label: "The City of God", url: "https://www.gutenberg.org/ebooks/45304" },
      { label: "His page on this site", url: "/teachers/augustine-of-hippo/" },
    ],
  },
  {
    name: "St. Hildegard of Bingen",
    years: "1098–1179",
    about: "Benedictine abbess, visionary, and composer. Her Scivias records her visions, and her songs are among the earliest music by a composer we know by name. Doctor of the Church, 2012.",
    image: hildegardImg,
    imageAlt: "Hildegard of Bingen receiving a vision and writing it down, from a medieval manuscript.",
    credit: { label: "From the Scivias manuscript", url: "https://commons.wikimedia.org/wiki/File:Hildegard_von_Bingen.jpg" },
    links: [
      { label: "Benedict XVI's letter naming her a Doctor", url: "https://www.vatican.va/content/benedict-xvi/en/apost_letters/documents/hf_ben-xvi_apl_20121007_ildegarda-bingen.html" },
      { label: "Her page on this site", url: "/teachers/hildegard-of-bingen/" },
    ],
  },
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
    name: "St. Catherine of Siena",
    years: "1347–1380",
    about: "A lay Dominican who counseled popes and urged the papacy's return from Avignon to Rome. She dictated The Dialogue, a conversation between the soul and God. Doctor of the Church, 1970.",
    image: catherineOfSienaImg,
    imageAlt: "Saint Catherine of Siena wearing a crown of thorns, by Tiepolo.",
    credit: { label: "Painting by Giovanni Battista Tiepolo", url: "https://commons.wikimedia.org/wiki/File:Giovanni_Battista_Tiepolo_096.jpg" },
    links: [
      { label: "The Dialogue", url: "https://ccel.org/ccel/catherine/dialog" },
      { label: "Her letters", url: "https://www.gutenberg.org/ebooks/7403" },
      { label: "Her page on this site", url: "/teachers/catherine-of-siena/" },
    ],
  },
  {
    name: "St. Teresa of Ávila",
    years: "1515–1582",
    about: "Carmelite reformer and mystic. Her Life and The Interior Castle map the soul's way into prayer. The first woman named a Doctor of the Church, 1970.",
    image: teresaOfAvilaImg,
    imageAlt: "Saint Teresa of Ávila in a Carmelite habit, hands joined in prayer.",
    credit: { label: "Painting, Museo del Prado", url: "https://commons.wikimedia.org/wiki/File:Santa_Teresa_de_Jes%C3%BAs_(Museo_del_Prado).jpg" },
    links: [
      { label: "Her Life", url: "https://www.gutenberg.org/ebooks/8120" },
      { label: "The Interior Castle", url: "https://ccel.org/ccel/teresa/castle2" },
      { label: "Her page on this site", url: "/teachers/teresa-of-avila/" },
    ],
  },
  {
    name: "St. John of the Cross",
    years: "1542–1591",
    about: "Carmelite friar and poet who joined Teresa in reforming the order. His poems and their commentaries, The Ascent of Mount Carmel and The Dark Night, are classics of Spanish literature and of prayer.",
    image: johnOfTheCrossImg,
    imageAlt: "Saint John of the Cross in a Carmelite habit.",
    credit: { label: "Painting attributed to Zurbarán", url: "https://commons.wikimedia.org/wiki/File:Zurbar%C3%A1n_(atribuido)-John_of_the_Cross-1656.jpg" },
    links: [
      { label: "The Dark Night", url: "https://ccel.org/ccel/john_cross/dark_night" },
      { label: "The Ascent of Mount Carmel", url: "https://ccel.org/ccel/john_cross/ascent" },
      { label: "His page on this site", url: "/teachers/john-of-the-cross/" },
    ],
  },
  {
    name: "St. John Henry Newman",
    years: "1801–1890",
    about: "Anglican leader who became Catholic in 1845 and later a cardinal. His Apologia Pro Vita Sua tells that journey, and The Dream of Gerontius follows a soul after death. Doctor of the Church, 2025.",
    image: newmanImg,
    imageAlt: "Photograph of Cardinal Newman in old age, resting his head on his hand.",
    credit: { label: "Photograph by Herbert Rose Barraud, 1887", url: "https://commons.wikimedia.org/wiki/File:John_Henry_Newman_1887_Portrait_Photograph_(3x4_cropped).jpg" },
    links: [
      { label: "Apologia Pro Vita Sua", url: "https://www.gutenberg.org/ebooks/22088" },
      { label: "The Dream of Gerontius", url: "https://www.gutenberg.org/ebooks/48927" },
      { label: "His page on this site", url: "/teachers/john-henry-newman/" },
    ],
  },
  {
    name: "Gerard Manley Hopkins",
    years: "1844–1889",
    about: "Jesuit priest and poet, received into the Church by Newman. His poems, published after his death, such as “God’s Grandeur” and “The Windhover,” find the world charged with God.",
    image: hopkinsImg,
    imageAlt: "Photograph of Gerard Manley Hopkins as a young man.",
    credit: { label: "Photograph, Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:GerardManleyHopkins.jpg" },
    links: [
      { label: "Poems of Gerard Manley Hopkins", url: "https://www.gutenberg.org/ebooks/22403" },
      { label: "Biography (Wikipedia)", url: "https://en.wikipedia.org/wiki/Gerard_Manley_Hopkins" },
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
  {
    name: "Sigrid Undset",
    years: "1882–1949",
    about: "Norwegian novelist who became Catholic in 1924. Her Kristin Lavransdatter trilogy, set in medieval Norway, helped win her the Nobel Prize in Literature in 1928.",
    image: undsetImg,
    imageAlt: "Photograph of Sigrid Undset in 1928.",
    credit: { label: "Photograph, 1928", url: "https://commons.wikimedia.org/wiki/File:Sigrid_Undset_1928.jpg" },
    focus: "50% 35%",
    links: [
      { label: "The Bridal Wreath (Kristin Lavransdatter, vol. 1)", url: "https://www.gutenberg.org/ebooks/67929" },
      { label: "Nobel Prize, 1928", url: "https://www.nobelprize.org/prizes/literature/1928/undset/facts/" },
    ],
  },
  {
    name: "François Mauriac",
    years: "1885–1970",
    about: "French Catholic novelist of sin and grace among the families of provincial Bordeaux. Thérèse Desqueyroux is his best-known novel. Nobel Prize in Literature, 1952.",
    image: mauriacImg,
    imageAlt: "Photograph of François Mauriac.",
    credit: { label: "Photograph, Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Fran%C3%A7ois_Mauriac_redux.jpg" },
    focus: "50% 30%",
    links: [
      { label: "Thérèse", url: "https://www.gutenberg.org/ebooks/73670" },
      { label: "Nobel Prize, 1952", url: "https://www.nobelprize.org/prizes/literature/1952/mauriac/facts/" },
    ],
  },
  {
    name: "Georges Bernanos",
    years: "1888–1948",
    about: "French novelist of grace and spiritual struggle. The Diary of a Country Priest closes with the dying priest's words, “Grace is everywhere.”",
    image: bernanosImg,
    imageAlt: "Photograph of Georges Bernanos.",
    credit: { label: "Photograph, Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Georges-Bernanos.jpg" },
    contain: "#edd8cb",
    links: [
      { label: "Biography (Wikipedia)", url: "https://en.wikipedia.org/wiki/Georges_Bernanos" },
      { label: "L'Imposture (in French)", url: "https://www.gutenberg.org/ebooks/78021" },
    ],
  },
  {
    name: "J. R. R. Tolkien",
    years: "1892–1973",
    about: "Oxford scholar of language and a devout Catholic. He called The Lord of the Rings “a fundamentally religious and Catholic work.”",
    image: tolkienImg,
    imageAlt: "Photograph of J. R. R. Tolkien around 1925.",
    credit: { label: "Photograph, about 1925", url: "https://commons.wikimedia.org/wiki/File:J._R._R._Tolkien,_ca._1925.jpg" },
    links: [
      { label: "The Tolkien Estate", url: "https://www.tolkienestate.com/" },
      { label: "Biography (Wikipedia)", url: "https://en.wikipedia.org/wiki/J._R._R._Tolkien" },
    ],
  },
  {
    name: "Evelyn Waugh",
    years: "1903–1966",
    about: "English novelist and satirist who became Catholic in 1930. Brideshead Revisited traces grace at work in an aristocratic Catholic family.",
    image: waughImg,
    imageAlt: "Photograph of Evelyn Waugh.",
    credit: { label: "Photograph, Wikimedia Commons", url: "https://commons.wikimedia.org/wiki/File:Evelynwaugh.jpeg" },
    links: [
      { label: "The Evelyn Waugh Society", url: "https://evelynwaughsociety.org/" },
      { label: "Biography (Wikipedia)", url: "https://en.wikipedia.org/wiki/Evelyn_Waugh" },
    ],
  },
  {
    name: "Walker Percy",
    years: "1916–1990",
    about: "A physician turned novelist who became Catholic in 1947. The Moviegoer won the National Book Award in 1962.",
    image: percyImg,
    imageAlt: "Photograph of Walker Percy smiling, in a tweed jacket.",
    credit: { label: "Photograph, Aspen Institute", url: "https://commons.wikimedia.org/wiki/File:Walker_Percy.jpg", license: "CC0" },
    links: [
      { label: "Mississippi Encyclopedia", url: "https://mississippiencyclopedia.org/entries/walker-percy/" },
      { label: "Biography (Wikipedia)", url: "https://en.wikipedia.org/wiki/Walker_Percy" },
    ],
  },
  {
    name: "Flannery O'Connor",
    years: "1925–1964",
    about: "Georgia writer whose stories, such as “A Good Man Is Hard to Find,” use violence and dark humor to show grace breaking into ordinary lives.",
    image: oconnorImg,
    imageAlt: "Photograph of Flannery O'Connor in 1947, smiling.",
    credit: { label: "Photograph, 1947, by Cmacauley", url: "https://commons.wikimedia.org/wiki/File:Flannery-O'Connor_1947.jpg", license: "CC BY-SA 3.0" },
    links: [
      { label: "New Georgia Encyclopedia", url: "https://www.georgiaencyclopedia.org/articles/arts-culture/flannery-oconnor-1925-1964/" },
      { label: "Biography (Wikipedia)", url: "https://en.wikipedia.org/wiki/Flannery_O%27Connor" },
    ],
  },
];

/**
 * A movie tile. When there's an official video, the picture is its YouTube thumbnail and opens it.
 * Use the studio's or distributor's own channel (or a licensed trailer channel), never a fan upload.
 * Without one, the tile shows the title instead of a picture.
 */
export interface Movie {
  title: string;
  year: number;
  director: string;
  /** e.g. "TV miniseries"; shown after the director. */
  kind?: string;
  about: string;
  /** YouTube video ID of the official trailer (or full film, see `videoLabel`). */
  trailer?: string;
  /** Link text for the video. Defaults to "Official trailer". */
  videoLabel?: string;
  /** Whose channel the video is on, e.g. "Sony Pictures Classics". */
  trailerFrom?: string;
  /**
   * Videos with no high-resolution thumbnail: 'hq' uses YouTube's standard one (its black bars are
   * cropped by the frame); 'letterboxed' also zooms in, for very wide films.
   */
  thumb?: 'hq' | 'letterboxed';
  links: ArtistLink[];
}

/** Movies, in order of release. */
export const MOVIES: Movie[] = [
  {
    title: "The Passion of Joan of Arc",
    year: 1928,
    director: "Carl Theodor Dreyer",
    about: "A silent film drawn from the actual record of St. Joan of Arc's trial. Renée Falconetti's performance as Joan is often called one of the finest in film history.",
    trailer: "B3A9F3TlsQE",
    videoLabel: "Trailer",
    trailerFrom: "The Criterion Collection",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/passionofjoanofarc" },
      { label: "On the Vatican's 1995 list of great films", url: "https://decentfilms.com/articles/vaticanfilmlist" },
    ],
  },
  {
    title: 'The Song of Bernadette',
    year: 1943,
    director: 'Henry King',
    about: 'The story of St. Bernadette Soubirous and the apparitions at Lourdes. Jennifer Jones won the Academy Award for Best Actress in the title role.',
    trailer: 'tdyLL5koREM',
    trailerFrom: '20th Century Studios',
    links: [
      { label: 'Review at Decent Films', url: 'https://decentfilms.com/reviews/songofbernadette' },
    ],
  },
  {
    title: "The Bells of St. Mary's",
    year: 1945,
    director: "Leo McCarey",
    about: "Bing Crosby's Father O'Malley and Ingrid Bergman's Sister Benedict, friendly rivals working to save their struggling parish school. Nominated for eight Academy Awards.",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/The_Bells_of_St._Mary%27s" },
    ],
  },
  {
    title: "Monsieur Vincent",
    year: 1947,
    director: "Maurice Cloche",
    about: "Pierre Fresnay as St. Vincent de Paul, who gave his life to the poor of 17th-century France. It received an honorary Academy Award.",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/monsieurvincent" },
      { label: "Steven Greydanus on the film (Catholic Culture)", url: "https://www.youtube.com/watch?v=5SrmmqNQgkc" },
      { label: "On the Vatican's 1995 list of great films", url: "https://decentfilms.com/articles/vaticanfilmlist" },
    ],
  },
  {
    title: "The Flowers of St. Francis",
    year: 1950,
    director: "Roberto Rossellini",
    about: "Episodes from the Little Flowers of St. Francis, co-written with Federico Fellini, with real Franciscan friars playing Francis's first companions.",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/flowersofstfrancis" },
      { label: "On the Vatican's 1995 list of great films", url: "https://decentfilms.com/articles/vaticanfilmlist" },
    ],
  },
  {
    title: "Diary of a Country Priest",
    year: 1951,
    director: "Robert Bresson",
    about: "Bresson's faithful adaptation of the Bernanos novel: a sickly young priest struggles in his first parish in northern France, and comes to see that all is grace.",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/diaryofacountrypriest" },
    ],
  },
  {
    title: "The Miracle of Our Lady of Fatima",
    year: 1952,
    director: "John Brahm",
    about: "The 1917 apparitions to Lucía, Jacinta, and Francisco, through to the Miracle of the Sun. Max Steiner's score was nominated for an Academy Award.",
    trailer: "1jOFyznf53w",
    trailerFrom: "Rotten Tomatoes Classic Trailers",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/miracleofourladyoffatima" },
    ],
  },
  {
    title: "Francis of Assisi",
    year: 1961,
    director: "Michael Curtiz",
    about: "Bradford Dillman as St. Francis and Dolores Hart as St. Clare. Hart left acting two years later to become a Benedictine nun.",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/Francis_of_Assisi_(film)" },
    ],
  },
  {
    title: "The Reluctant Saint",
    year: 1962,
    director: "Edward Dmytryk",
    about: "Maximilian Schell as St. Joseph of Cupertino, the slow, humble friar whose prayer lifted him off the ground.",
    trailer: "UYwmuqHIRSM",
    trailerFrom: "Ignatius Press",
    thumb: "hq",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/The_Reluctant_Saint" },
    ],
  },
  {
    title: "The Cardinal",
    year: 1963,
    director: "Otto Preminger",
    about: "Tom Tryon as a Boston priest whose path to the College of Cardinals runs through family crises, the Jim Crow South, and Vienna on the eve of the Nazi takeover. Nominated for six Academy Awards.",
    trailer: "FfXlg1yVaRY",
    trailerFrom: "Rotten Tomatoes Classic Trailers",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/The_Cardinal" },
    ],
  },
  {
    title: "The Gospel According to St. Matthew",
    year: 1964,
    director: "Pier Paolo Pasolini",
    about: "The life of Christ told almost entirely in the words of Matthew's Gospel, with a cast of non-professional actors. Pasolini dedicated it to Pope John XXIII.",
    trailer: "xEs4g9A9HGc",
    trailerFrom: "BFI",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/gospelaccordingtomatthew" },
      { label: "On the Vatican's 1995 list of great films", url: "https://decentfilms.com/articles/vaticanfilmlist" },
    ],
  },
  {
    title: 'A Man for All Seasons',
    year: 1966,
    director: 'Fred Zinnemann',
    about: 'Paul Scofield as St. Thomas More, who chose the scaffold over approving Henry VIII\u2019s divorce. Winner of six Academy Awards, including Best Picture.',
    trailer: 'HM7jj9t2CQ8',
    trailerFrom: 'Eureka Entertainment',
    links: [
      { label: 'Review at Decent Films', url: 'https://decentfilms.com/reviews/manforallseasons' },
      { label: "On the Vatican's 1995 list of great films", url: 'https://decentfilms.com/articles/vaticanfilmlist' },
    ],
  },
  {
    title: "Jesus of Nazareth",
    year: 1977,
    director: "Franco Zeffirelli",
    kind: "TV miniseries",
    about: "Robert Powell as Jesus, from the Nativity to the Resurrection, with Laurence Olivier, Anne Bancroft, and many other stars.",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/jesusofnazareth" },
    ],
  },
  {
    title: "The Scarlet and the Black",
    year: 1983,
    director: "Jerry London",
    kind: "TV film",
    about: "Gregory Peck as Msgr. Hugh O'Flaherty, the Irish priest at the Vatican who hid thousands of escaped Allied prisoners and Jews in occupied Rome. Christopher Plummer plays his Nazi adversary.",
    trailer: "AlNlrT60KdA",
    videoLabel: "Full film, free on YouTube",
    trailerFrom: "Shout! Studios",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/scarletandtheblack" },
    ],
  },
  {
    title: "Thérèse",
    year: 1986,
    director: "Alain Cavalier",
    about: "Catherine Mouchet as St. Thérèse of Lisieux, in a spare, quiet portrait of her life in the Carmel. Jury Prize at Cannes.",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/therese1986" },
      { label: "On the Vatican's 1995 list of great films", url: "https://decentfilms.com/articles/vaticanfilmlist" },
    ],
  },
  {
    title: 'The Mission',
    year: 1986,
    director: 'Roland Joffé',
    about: "Jesuits among the Guaraní in 18th-century South America: Jeremy Irons as Father Gabriel and Robert De Niro as a slave trader turned Jesuit. Palme d'Or at Cannes, with Ennio Morricone's score.",
    trailer: 'HU14R9hbUFc',
    trailerFrom: 'Warner Bros.',
    thumb: 'letterboxed',
    links: [
      { label: 'Review at Decent Films', url: 'https://decentfilms.com/reviews/mission' },
      { label: "On the Vatican's 1995 list of great films", url: 'https://decentfilms.com/articles/vaticanfilmlist' },
    ],
  },
  {
    title: "Au Revoir les Enfants",
    year: 1987,
    director: "Louis Malle",
    about: "Malle's memory of his Carmelite boarding school, where Père Jacques hid Jewish boys from the Nazis. Golden Lion at Venice.",
    trailer: "IXDLcrRb0X4",
    videoLabel: "Trailer",
    trailerFrom: "The Criterion Collection",
    thumb: "hq",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/aurevoirlesenfants" },
      { label: "On the Vatican's 1995 list of great films", url: "https://decentfilms.com/articles/vaticanfilmlist" },
    ],
  },
  {
    title: "Romero",
    year: 1989,
    director: "John Duigan",
    about: "Raúl Juliá as St. Óscar Romero, the archbishop of San Salvador shot while saying Mass in 1980. Canonized in 2018.",
    trailer: "HDUwjD_hM6I",
    videoLabel: "Trailer",
    trailerFrom: "Paulist Productions",
    thumb: "hq",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/romero" },
    ],
  },
  {
    title: "Padre Pio: Miracle Man",
    year: 2000,
    director: "Carlo Carlei",
    kind: "TV film",
    about: "Sergio Castellitto as St. Pio of Pietrelcina, the Capuchin friar known for the stigmata and long hours in the confessional.",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/Padre_Pio:_Miracle_Man" },
    ],
  },
  {
    title: "Thérèse",
    year: 2004,
    director: "Leonardo Defilippis",
    about: "Lindsay Younce as St. Thérèse of Lisieux, in an independent American telling of her Little Way.",
    trailer: "YUieEdXgyXI",
    videoLabel: "Trailer",
    trailerFrom: "Saint Luke Productions",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/therese2004" },
    ],
  },
  {
    title: 'The Passion of the Christ',
    year: 2004,
    director: 'Mel Gibson',
    about: 'The last twelve hours of Jesus, from Gethsemane to the Cross, with Jim Caviezel as Christ. Filmed in Aramaic, Hebrew, and Latin, and drawn from the Gospels and the Stations of the Cross.',
    trailer: 'ezOafmA21NY',
    trailerFrom: 'Lionsgate',
    links: [
      { label: 'Its Catholic meaning, at Decent Films', url: 'https://decentfilms.com/articles/passion_meaning' },
    ],
  },
  {
    title: "Karol: A Man Who Became Pope",
    year: 2005,
    director: "Giacomo Battiato",
    kind: "TV miniseries",
    about: "Karol Wojtyła from 1939, under the Nazi and then Soviet occupations of Poland, to his election as pope in 1978.",
    trailer: "NL4N0_vf2dM",
    videoLabel: "Trailer",
    trailerFrom: "Ignatius Press",
    thumb: "hq",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/Karol:_A_Man_Who_Became_Pope" },
    ],
  },
  {
    title: "Pope John Paul II",
    year: 2005,
    director: "John Kent Harrison",
    kind: "TV miniseries",
    about: "Cary Elwes as the young Karol Wojtyła and Jon Voight as John Paul II, from his early adult years in Poland to his death.",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/Pope_John_Paul_II_(miniseries)" },
    ],
  },
  {
    title: "St. Giuseppe Moscati: Doctor to the Poor",
    year: 2007,
    director: "Giacomo Campiotti",
    kind: "TV film",
    about: "Giuseppe Fiorello as St. Giuseppe Moscati, a Naples physician and researcher who treated the poor for free. Canonized in 1987.",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/St._Giuseppe_Moscati:_Doctor_to_the_Poor" },
    ],
  },
  {
    title: 'Of Gods and Men',
    year: 2010,
    director: 'Xavier Beauvois',
    about: 'The Trappist monks of Tibhirine, Algeria, who chose to stay with their Muslim neighbors amid civil war and were killed in 1996. They were beatified in 2018. Grand Prix, Cannes.',
    trailer: 'nhQzn2gVGjQ',
    trailerFrom: 'Sony Pictures Classics',
    links: [
      { label: 'Review at Decent Films', url: 'https://decentfilms.com/reviews/ofgodsandmen' },
    ],
  },
  {
    title: "The Letters",
    year: 2014,
    director: "William Riead",
    about: "Juliet Stevenson as St. Teresa of Calcutta, told through her letters to her spiritual director over nearly fifty years.",
    trailer: "UAS_EeIxh5g",
    trailerFrom: "Rotten Tomatoes Indie",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/The_Letters_(2014_film)" },
    ],
  },
  {
    title: "Ignatius of Loyola",
    year: 2016,
    director: "Paolo Dy",
    about: "Andreas Muñoz as St. Ignatius, from soldier to the conversion that led to the Spiritual Exercises and the Jesuits. Made by the Jesuits' communications office in the Philippines.",
    trailer: "qfuaLkKjynI",
    trailerFrom: "Jesuit Communications",
    thumb: "hq",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/Ignacio_de_Loyola" },
    ],
  },
  {
    title: 'A Hidden Life',
    year: 2019,
    director: 'Terrence Malick',
    about: 'Blessed Franz J\u00e4gerst\u00e4tter, an Austrian farmer executed in 1943 for refusing to fight for Hitler. He was beatified in 2007.',
    trailer: 'qJXmdY4lVR0',
    trailerFrom: 'Searchlight Pictures',
    links: [
      { label: 'Review at Decent Films', url: 'https://decentfilms.com/reviews/hiddenlife' },
    ],
  },
  {
    title: "Fatima",
    year: 2020,
    director: "Marco Pontecorvo",
    about: "The 1917 apparitions retold, with Sônia Braga as the elderly Sister Lúcia looking back and Harvey Keitel as a skeptical professor.",
    trailer: "x91nQuhzLBE",
    trailerFrom: "Picturehouse",
    links: [
      { label: "Review at Decent Films", url: "https://decentfilms.com/reviews/fatima2020" },
    ],
  },
  {
    title: "Cabrini",
    year: 2024,
    director: "Alejandro Gómez Monteverde",
    about: "Cristiana Dell'Anna as St. Frances Xavier Cabrini, building orphanages and hospitals for Italian immigrants in New York against fierce opposition.",
    trailer: "uuFkt3w-7kI",
    trailerFrom: "Angel Studios",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/Cabrini_(film)" },
    ],
  },
  {
    title: "Triumph of the Heart",
    year: 2025,
    director: "Anthony D'Ambrosio",
    about: "The final days of St. Maximilian Kolbe, who offered his life in place of another prisoner at Auschwitz.",
    trailer: "Y29VTf8LHhs",
    trailerFrom: "Triumph of the Heart",
    links: [
      { label: "About the film (Wikipedia)", url: "https://en.wikipedia.org/wiki/Triumph_of_the_Heart" },
    ],
  },
];
