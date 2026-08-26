# Courier Inbox — Next.js quickstart

A working [Courier Inbox](https://www.courier.com/docs/in-app/overview) in a Next.js App Router app. Clone it, add an API key, and you have a real-time notification inbox in about five minutes.

This is the companion project for [Add an inbox to Next.js](https://www.courier.com/docs/guides/add-an-inbox-to-nextjs) in the Courier docs.

## What it shows

- **A server route that mints the JWT** — `app/api/courier/token/route.ts`. Your Courier API key signs the token and never reaches the browser.
- **The inbox as a client component** — `components/courier-inbox.tsx`. `"use client"` is required; `next/dynamic` with `ssr: false` is not.
- **One send that lands in the inbox** — `scripts/send.ts`, routed to the `inbox` channel.

Four files. Everything else is `create-next-app` defaults.

## Run it

You need Node 20.9 or newer and a [Courier account](https://app.courier.com/signup).

```bash
git clone https://github.com/trycourier/courier-nextjs-quickstart.git
cd courier-nextjs-quickstart
npm install
cp .env.example .env.local
```

Put your key from [Settings → API Keys](https://app.courier.com/settings/api-keys) in `.env.local`. A **Test** key is fine — the inbox channel delivers in Test, unlike email.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). The inbox renders, signed in and empty.

Then, in a second terminal:

```bash
npm run send
```

The message appears in the open page in real time. No refresh.

## How the pieces fit

```
Browser                     Your server                  Courier
   |                             |                          |
   |-- GET /api/courier/token -->|                          |
   |                             |-- POST /auth/issue-token>|   (API key)
   |<------ { userId, token } ---|<---------- JWT ----------|
   |                                                        |
   |-- signIn({ userId, jwt }) ---------------------------->|   (scoped JWT)
   |<===================== inbox messages, live ============|
```

The API key is a server secret. The JWT is scoped to one user and expires, so it is safe to hand to a browser.

## Adapting it to your app

**Read the real user.** `lib/demo-user.ts` pins a constant so the sample works without auth wired up. In your app, delete it and read the user id from your session inside the token route:

```ts
// app/api/courier/token/route.ts
const session = await auth();            // NextAuth, Clerk, Supabase, your own
if (!session) return new Response("Unauthorized", { status: 401 });
const userId = session.user.id;
```

Never take the user id from the request. A caller who can name any user can read that user's inbox.

**Match the token lifetime to your session.** The route asks for `1 day`. The SDKs do not refresh tokens — mint a new one and call `signIn` again before the old one expires. Omitting `expires_in` mints a token that never expires; don't.

**Use a template.** `scripts/send.ts` sends inline content so the sample runs against a fresh workspace. In production, reference a published template by id and keep copy out of your code.

## Scripts

| | |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run send` | Send one message to the demo user's inbox |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |

## Troubleshooting

**The inbox renders but stays empty.** Almost always the token. Decode it at [jwt.io](https://www.jwt.io) and check `exp` is in the future, the scope contains `inbox:read:messages` and `inbox:write:events`, and the `user_id:` in the scope matches the `userId` passed to `signIn`. A bad token signs in without error and returns nothing.

**"Courier rejected the API key."** The key in `.env.local` is wrong, or the dev server was started before you saved it. Restart it.

**`npm run send` reports success but nothing arrives.** Check that the send's `user_id` matches the signed-in user, and look at the message in [Courier's logs](https://app.courier.com/logs) — a `SIMULATED` or `UNROUTABLE` status says what happened.

## Further reading

- [Add an inbox](https://www.courier.com/docs/in-app/add-an-inbox) — every framework, not just Next.js
- [Authenticate users](https://www.courier.com/docs/in-app/authenticate-users) — the full scope list and token refresh
- [Send to the inbox](https://www.courier.com/docs/in-app/send-to-the-inbox) — templates, and scoping to a tenant
- [Customize the inbox](https://www.courier.com/docs/in-app/customize-the-inbox) — theming, and building your own UI

## License

MIT
