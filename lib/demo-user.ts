/**
 * The one user this sample signs in and sends to.
 *
 * In a real app there is no constant here: the user id comes from whatever
 * session your app already has (NextAuth, Clerk, Supabase, your own cookie).
 * It is pinned to a constant so the token route and the send script agree
 * without you having to wire up auth to see the inbox work.
 */
export const DEMO_USER_ID = "nomen-nescio";

/** Shown in the UI, and passed to the send as template data. */
export const DEMO_USER_NAME = "Nomen Nescio";
