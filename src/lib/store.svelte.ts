/**
 * Local-first personal data: prayer list, saved prayers, saved passages, and today's rhythm.
 * Everything stays in this browser's localStorage. Nothing is sent to a server.
 * Islands on the same page share this module, so they stay in sync.
 */

export interface Person { id: string; name: string; intention?: string; prayedOn?: string; }
export interface Passage { id: string; ref: string; text?: string; note?: string; savedAt: string; }
interface Data {
  version: 1;
  prayerList: Person[];
  savedPrayers: string[];
  passages: Passage[];
  rhythm: { date: string; done: string[] };
}

const KEY = 'mmc:v1';

export const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time

function empty(): Data {
  return { version: 1, prayerList: [], savedPrayers: [], passages: [], rhythm: { date: today(), done: [] } };
}

function load(): Data {
  if (typeof localStorage === 'undefined') return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const d = { ...empty(), ...JSON.parse(raw) } as Data;
    if (d.rhythm.date !== today()) d.rhythm = { date: today(), done: [] };
    return d;
  } catch {
    return empty();
  }
}

export const store = $state<Data>(load());

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* Storage blocked (private mode); data lives for this visit only. */
  }
}

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

export function addPerson(name: string, intention?: string) {
  store.prayerList.unshift({ id: uid(), name, intention: intention || undefined });
  persist();
}
export function removePerson(id: string) {
  store.prayerList = store.prayerList.filter((p) => p.id !== id);
  persist();
}
export function togglePrayed(id: string) {
  const p = store.prayerList.find((x) => x.id === id);
  if (!p) return;
  p.prayedOn = p.prayedOn === today() ? undefined : today();
  persist();
}

export function isPrayerSaved(id: string) {
  return store.savedPrayers.includes(id);
}
export function togglePrayer(id: string) {
  store.savedPrayers = isPrayerSaved(id) ? store.savedPrayers.filter((x) => x !== id) : [...store.savedPrayers, id];
  persist();
}

export function isPassageSaved(ref: string) {
  return store.passages.some((p) => p.ref === ref);
}
export function savePassage(ref: string, text?: string, note?: string) {
  if (isPassageSaved(ref)) return;
  store.passages.unshift({ id: uid(), ref, text, note: note || undefined, savedAt: new Date().toISOString() });
  persist();
}
export function removePassage(ref: string) {
  store.passages = store.passages.filter((p) => p.ref !== ref);
  persist();
}

export function isDone(step: string) {
  return store.rhythm.date === today() && store.rhythm.done.includes(step);
}
export function toggleStep(step: string) {
  if (store.rhythm.date !== today()) store.rhythm = { date: today(), done: [] };
  store.rhythm.done = isDone(step) ? store.rhythm.done.filter((s) => s !== step) : [...store.rhythm.done, step];
  persist();
}
