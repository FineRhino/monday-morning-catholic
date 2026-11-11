import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase client for signed-in visitors, or null when accounts aren't configured
 * (no PUBLIC_SUPABASE_* variables at build time) or when rendering on the server.
 * The publishable key is meant to be public; row level security protects the data.
 */
const url: string | undefined = import.meta.env.PUBLIC_SUPABASE_URL;
const key: string | undefined = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase: SupabaseClient | null = typeof window !== 'undefined' && url && key ? createClient(url, key) : null;

/** Whether this build has accounts turned on. Safe to read on the server too. */
export const accountsEnabled = Boolean(url && key);
