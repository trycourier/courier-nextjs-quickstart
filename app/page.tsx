import { Inbox } from "@/components/courier-inbox";
import { DEMO_USER_ID, DEMO_USER_NAME } from "@/lib/demo-user";

export default function Home() {
  return (
    <main>
      <header>
        <h1>Courier Inbox</h1>
        <p>
          Signed in as <strong>{DEMO_USER_NAME}</strong> <code>{DEMO_USER_ID}</code>
        </p>
      </header>

      <Inbox />

      <footer>
        <p>
          Empty? Run <code>npm run send</code> in another terminal. The message arrives
          here in real time — no refresh.
        </p>
      </footer>
    </main>
  );
}
