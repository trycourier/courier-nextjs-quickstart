import Courier from "@trycourier/courier";
import { DEMO_USER_ID } from "@/lib/demo-user";

/**
 * Mints a short-lived Courier JWT for the signed-in user.
 *
 * This route is the whole reason the sample has a server: your Courier API key
 * signs the token, and it must never reach the browser. The client calls this
 * endpoint, gets a scoped token, and hands that to the SDK.
 */
export async function GET() {
  const apiKey = process.env.COURIER_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "COURIER_API_KEY is not set. Copy .env.example to .env.local, add your key, and restart the dev server." },
      { status: 500 },
    );
  }

  // ── Replace this with your own session lookup ────────────────────────────
  // Whatever your app uses — getServerSession(), auth(), a cookie — read the
  // user id from it here. Never take the user id from the request: a caller
  // who can name any user can read that user's inbox.
  const userId = DEMO_USER_ID;
  // ─────────────────────────────────────────────────────────────────────────

  const client = new Courier({ apiKey });

  try {
    const { token } = await client.auth.issueToken({
      scope: `user_id:${userId} inbox:read:messages inbox:write:events`,
      // Always set this. Omitting it mints a token that never expires.
      expires_in: "1 day",
    });

    return Response.json({ userId, token });
  } catch (cause) {
    // Without this, a mistyped key surfaces as a blank 500 and the inbox just
    // sits empty. Say what went wrong instead.
    const status = typeof cause === "object" && cause !== null && "status" in cause
      ? Number(cause.status)
      : undefined;

    const message = status === 401 || status === 403
      ? "Courier rejected the API key. Check COURIER_API_KEY in .env.local."
      : `Could not issue a Courier token${status ? ` (HTTP ${status})` : ""}.`;

    console.error("[courier] issueToken failed:", cause);
    return Response.json({ error: message }, { status: 500 });
  }
}
