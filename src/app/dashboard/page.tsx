import { auth } from "@/auth";
import SignOutButton from "@/components/auth/SignOutButton";
import DarkModeButton from "@/components/DarkModeButton";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    // TODO: Abstract these into components.
    // Learn from Supabase github on best practices for components.
    <div className="min-h-svh min-w-svw text-light-mode-text-main dark:text-dark-mode-text-main bg-light-mode-main dark:bg-dark-mode-main dark:stroke-dark-mode-svg-main stroke-light-mode-svg-main overflow-x-auto">
      <nav>
        <div>[Logo] caa</div>
        <div>
          <Link href="/dashboard">[Icon] Dashboard</Link>
        </div>
        <div>
          <Link href="/chat">[Icon] LLM for Security</Link>
        </div>

        <div>
          <a href="https://github.com/soobinrho/caa-supabase">
            [Icon] Documentation
          </a>
        </div>
        <div>[Icon] {"Light Mode | Dark Mode"}</div>

        <div>
          [Profile Picture]
          <div>[Drop down menu] Sign out</div>
        </div>
      </nav>
      <main>
        <aside>
          [https://ui.shadcn.com/docs/components/accordion style side bar]
        </aside>

        <div>
          [Main Content Area]
        </div>
      </main>


      <div>
        <h2>Debugging Area</h2>
      <DarkModeButton />
      <SignOutButton />
    </div>
    </div>
  );
}
