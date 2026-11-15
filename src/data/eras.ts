/**
 * The periods on the Teachers pages. The four Church eras meet so anyone can be placed in one.
 * The Scriptures come first; on the timeline they get their own Old and New Testament parts.
 */
export const ERAS = [
  { id: 'era0', name: 'The Scriptures', span: 'Old and New Testaments' },
  { id: 'era1', name: 'The Church Fathers', span: 'c. 100 – 750' },
  { id: 'era2', name: 'The Middle Ages', span: '750 – 1500' },
  { id: 'era3', name: 'Reform and Renewal', span: '1500 – 1700' },
  { id: 'era4', name: 'The Modern Era', span: '1700 – today' },
] as const;