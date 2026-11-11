/**
 * Personal data: prayer list, saved prayers, saved passages, and today's rhythm.
 *
 * Signed out, everything stays in this browser's localStorage, as before.
 * Signed in, the same data is kept in Supabase so it follows the visitor to any device.
 * Changes show on the page at once; for signed-in visitors they are also written to
 * the database, and if a write fails the page reloads what the database actually has.
 *
 * Islands on the same page share this module, so they stay in sync.
 */
import { supabase } from './supabase';

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

/** Who is signed in, whether that is known yet, and the last sync problem to show. */
export const account = $state<{ user: { id: string; email: string } | null; ready: boolean; error: string }>({
  user: null,
  ready: false,
  error: '',
});

function setAll(d: Data) {
  store.prayerList = d.prayerList;
  store.savedPrayers = d.savedPrayers;
  store.passages = d.passages;
  store.rhythm = d.rhythm;
}

/** Saves to this browser. Signed-in data lives in the database instead. */
function persist() {
  if (account.user) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* Storage blocked (private mode); data lives for this visit only. */
  }
}

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  // UUID v4 fallback, so ids are always valid in the database.
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

// ---------- Database sync (signed-in visitors only) ----------

type Result = PromiseLike<{ error: { message: string } | null }>;

/** Runs a write for a signed-in visitor. If it fails, shows why and reloads what the database has. */
function remote(write: (db: NonNullable<typeof supabase>, userId: string) => Result) {
  if (!supabase || !account.user) return;
  void Promise.resolve(write(supabase, account.user.id)).then(async ({ error }) => {
    if (!error) return;
    account.error = `Couldn't save that change. ${error.message}`;
    await loadRemote();
  });
}

async function loadRemote() {
  if (!supabase || !account.user) return;
  const [people, prayers, passages, steps] = await Promise.all([
    supabase.from('prayer_list').select('id, name, intention, prayed_on').order('created_at', { ascending: false }),
    supabase.from('saved_prayers').select('prayer_id').order('created_at'),
    supabase.from('passages').select('id, ref, text, note, saved_at').order('saved_at', { ascending: false }),
    supabase.from('rhythm_steps').select('step').eq('day', today()),
  ]);
  const error = people.error ?? prayers.error ?? passages.error ?? steps.error;
  if (error) {
    account.error = `Couldn't load your saved items. ${error.message}`;
    return;
  }
  setAll({
    version: 1,
    prayerList: (people.data ?? []).map((r) => ({ id: r.id, name: r.name, intention: r.intention ?? undefined, prayedOn: r.prayed_on ?? undefined })),
    savedPrayers: (prayers.data ?? []).map((r) => r.prayer_id),
    passages: (passages.data ?? []).map((r) => ({ id: r.id, ref: r.ref, text: r.text ?? undefined, note: r.note ?? undefined, savedAt: r.saved_at })),
    rhythm: { date: today(), done: (steps.data ?? []).map((r) => r.step) },
  });
}

/** On sign-in, copies anything saved in this browser into the account, then clears the browser copy. */
async function uploadLocal(userId: string) {
  if (!supabase) return;
  const local = load();
  const done = local.rhythm.date === today() ? local.rhythm.done : [];
  if (!local.prayerList.length && !local.savedPrayers.length && !local.passages.length && !done.length) return;
  const ok = { error: null };
  const results = await Promise.all([
    local.prayerList.length
      ? supabase.from('prayer_list').upsert(
          local.prayerList.map((p) => ({ id: isUuid(p.id) ? p.id : uid(), user_id: userId, name: p.name, intention: p.intention ?? null, prayed_on: p.prayedOn ?? null })),
          { onConflict: 'id', ignoreDuplicates: true },
        )
      : ok,
    local.savedPrayers.length
      ? supabase.from('saved_prayers').upsert(local.savedPrayers.map((prayer_id) => ({ user_id: userId, prayer_id })), { onConflict: 'user_id,prayer_id', ignoreDuplicates: true })
      : ok,
    local.passages.length
      ? supabase.from('passages').upsert(
          local.passages.map((p) => ({ id: isUuid(p.id) ? p.id : uid(), user_id: userId, ref: p.ref, text: p.text ?? null, note: p.note ?? null, saved_at: p.savedAt })),
          { onConflict: 'user_id,ref', ignoreDuplicates: true },
        )
      : ok,
    done.length
      ? supabase.from('rhythm_steps').upsert(done.map((step) => ({ user_id: userId, day: today(), step })), { onConflict: 'user_id,day,step', ignoreDuplicates: true })
      : ok,
  ]);
  const error = results.find((r) => r.error)?.error;
  if (error) {
    // Keep the browser copy so nothing is lost; the next sign-in tries again.
    account.error = `Couldn't copy this device's saved items into your account. ${error.message}`;
    return;
  }
  try {
    localStorage.removeItem(KEY);
  } catch { /* nothing to clear */ }
}

async function switchUser(next: { id: string; email: string } | null) {
  account.user = next;
  account.error = '';
  if (next) {
    await uploadLocal(next.id);
    await loadRemote();
  } else {
    setAll(load());
  }
  account.ready = true;
}

if (typeof window !== 'undefined') {
  if (supabase) {
    // Fires once on load with the current session, then on every sign-in and sign-out.
    supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      const next = u ? { id: u.id, email: u.email ?? '' } : null;
      if (next?.id === account.user?.id) {
        account.ready = true;
        return;
      }
      // Supabase advises not to call it again from inside this callback, so defer the work.
      setTimeout(() => void switchUser(next), 0);
    });
  } else {
    account.ready = true;
  }
}

// ---------- Account actions ----------

export async function sendSignInCode(email: string) {
  if (!supabase) throw new Error('Accounts are not set up on this site.');
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/account/`, shouldCreateUser: true } });
  if (error) throw error;
}

export async function verifySignInCode(email: string, token: string) {
  if (!supabase) throw new Error('Accounts are not set up on this site.');
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error) throw error;
}

export async function signOut() {
  await supabase?.auth.signOut();
}

/** Deletes the account and everything saved in it. */
export async function deleteAccount() {
  if (!supabase) return;
  const { error } = await supabase.rpc('delete_my_account');
  if (error) throw error;
  await supabase.auth.signOut({ scope: 'local' });
}

/** Everything saved, as a JSON string for download. */
export function exportData(): string {
  const { prayerList, savedPrayers, passages } = store;
  return JSON.stringify({ exportedAt: new Date().toISOString(), prayerList, savedPrayers, passages }, null, 2);
}

// ---------- Prayer list ----------

export function addPerson(name: string, intention?: string) {
  const p: Person = { id: uid(), name, intention: intention || undefined };
  store.prayerList.unshift(p);
  persist();
  remote((db, user_id) => db.from('prayer_list').insert({ id: p.id, user_id, name, intention: p.intention ?? null }));
}
export function removePerson(id: string) {
  store.prayerList = store.prayerList.filter((p) => p.id !== id);
  persist();
  remote((db) => db.from('prayer_list').delete().eq('id', id));
}
export function togglePrayed(id: string) {
  const p = store.prayerList.find((x) => x.id === id);
  if (!p) return;
  p.prayedOn = p.prayedOn === today() ? undefined : today();
  persist();
  remote((db) => db.from('prayer_list').update({ prayed_on: p.prayedOn ?? null }).eq('id', id));
}

// ---------- Saved prayers ----------

export function isPrayerSaved(id: string) {
  return store.savedPrayers.includes(id);
}
export function togglePrayer(id: string) {
  const saving = !isPrayerSaved(id);
  store.savedPrayers = saving ? [...store.savedPrayers, id] : store.savedPrayers.filter((x) => x !== id);
  persist();
  remote((db, user_id) => (saving ? db.from('saved_prayers').insert({ user_id, prayer_id: id }) : db.from('saved_prayers').delete().eq('prayer_id', id)));
}

// ---------- Saved passages ----------

export function isPassageSaved(ref: string) {
  return store.passages.some((p) => p.ref === ref);
}
export function savePassage(ref: string, text?: string, note?: string) {
  if (isPassageSaved(ref)) return;
  const p: Passage = { id: uid(), ref, text, note: note || undefined, savedAt: new Date().toISOString() };
  store.passages.unshift(p);
  persist();
  remote((db, user_id) => db.from('passages').insert({ id: p.id, user_id, ref, text: text ?? null, note: p.note ?? null, saved_at: p.savedAt }));
}
export function removePassage(ref: string) {
  store.passages = store.passages.filter((p) => p.ref !== ref);
  persist();
  remote((db) => db.from('passages').delete().eq('ref', ref));
}

// ---------- Today's rhythm ----------

export function isDone(step: string) {
  return store.rhythm.date === today() && store.rhythm.done.includes(step);
}
export function toggleStep(step: string) {
  if (store.rhythm.date !== today()) store.rhythm = { date: today(), done: [] };
  const checking = !isDone(step);
  store.rhythm.done = checking ? [...store.rhythm.done, step] : store.rhythm.done.filter((s) => s !== step);
  persist();
  const day = store.rhythm.date;
  remote((db, user_id) => (checking ? db.from('rhythm_steps').insert({ user_id, day, step }) : db.from('rhythm_steps').delete().eq('day', day).eq('step', step)));
}
