import { auth } from "@/auth";
import SignOutButton from "@/components/auth/SignOutButton";
import DarkModeButton from "@/components/DarkModeButton";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // TODO: Abstract these into components. // Learn from Supabase github on
  // best practices for components.
  return (
    <>
      {/* Entire viewport. */}
      <div className="min-h-svh min-w-xs max-w-full">
        {/*
            1. Header Area
        */}
        <div className="flex w-full justify-between content-start flex-nowrap border-b-[0.08rem] border-dashed top-0 sticky">
          {/* Empty space on the left for 2xl screens and above. */}
          <div></div>
          {/* The middle space in-between the empty spaces. */}
          <div className="min-w-xs w-full 2xl:max-w-[80%] border-x-[0.08rem] border-dashed backdrop-blur-[1rem]">
            <header className="px-8 py-4">
              <nav className="inline">
                <span className="">[Logo] caa</span>
                <span>
                  <Link href="/dashboard">[Icon] Dashboard</Link>
                </span>
                <span>
                  <Link href="/chat">[Icon] LLM for Security</Link>
                </span>

                <span>
                  <a href="https://github.com/soobinrho/caa-supabase">
                    [Icon] Documentation
                  </a>
                </span>
                <span>[Icon] {"Light Mode | Dark Mode"}</span>

                <span>
                  [Profile Picture]
                  <span>[Drop down menu] Sign out</span>
                </span>
              </nav>
            </header>
          </div>
          {/* Empty space on the right for 2xl screens and above. */}
          <div></div>
        </div>
        {/*
            2. Main Area
        */}
        <div className="flex w-full justify-between content-start flex-nowrap">
          {/* Empty space on the left for 2xl screens and above. */}
          <div></div>
          {/* The middle space in-between the empty spaces. */}
          <div className="min-h-svh min-w-xs w-full 2xl:max-w-[80%] border-x-[0.08rem] border-dashed">
            <main className="px-16 py-8">
              <aside>
                <p>[https://ui.shadcn.com/docs/components/sidebar]</p>
                <p>
                  Big screen behavior: No button for collapsing or opening the
                  sidebar. It's always on.
                </p>
                <p>
                  Small screen behavior: Button for collapsing or opening the
                  sidebar. Floating variant.
                </p>
                <section>
                  <h2>TODO: Items in the nav bar</h2>
                  <p>
                    1. The main page should be what the user wants the most.
                    This kind of info should be located at the path of least
                    resistance. Mode: How scadcn's website reads. Top to bottom
                    and left to right design principle. Make it easy for user to
                    follow the instructions, ideally in just one step.
                  </p>

                  <p>
                    2. Include "Getting Started" page with super simple
                    instructions. Think of how easy setting up Cloudflare Tunnel
                    is. They give you a little box highlighting how to execute
                    the script to do the tunneling. I think this should be the
                    main page of the dashboard.
                  </p>
                  <p>
                    3. Include "Manage" button at the "Getting Started" page.
                    Allow the user to generate a new client-side script, which
                    will remove the previous API key and populate the new
                    client-side script with the new key.
                  </p>

                  <p>4. Include MFA, PITR, and RLS.</p>
                </section>
              </aside>
              <article>
                <p>[Main content based on the page]</p>
                <p>[https://ui.shadcn.com/docs/components/data-table]</p>

                <p>
                  Allow the user to delete any item, or edit, but not add.
                  Adding should only be done via the client side Python program.
                </p>
              </article>
            </main>
            <footer className="px-16 py-8">
              <div>
                <h2>Debugging Area</h2>
                <DarkModeButton />
                <SignOutButton />
              </div>
            </footer>
          </div>
          {/* Empty space on the right for 2xl screens and above. */}
          <div></div>
        </div>
      </div>
    </>
  );
}
