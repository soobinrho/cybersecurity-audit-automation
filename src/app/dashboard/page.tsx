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
                [https://ui.shadcn.com/docs/components/accordion style side bar]
              </aside>
              <article>[Main content based on the page]</article>
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
