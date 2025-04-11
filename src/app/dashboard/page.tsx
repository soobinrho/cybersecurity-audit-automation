import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientSideScriptDownload } from "@/components/dashboard/ClientSideScriptDownload";
import InlineCode from "@/components/dashboard/InlineCode";
export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <ScrollArea>
      <article className="px-9 pb-1 pt-7 md:px-16 md:py-9 xl:px-20 xl:py-12 2xl:px-36 2xl:py-18 text-pretty leading-loose">
        <h2 className="text-2xl font-bold pb-4">Getting Started</h2>
        <section className="pb-4">
          <h3
            id="1-download-your-client-side-python-script"
            className="font-semibold pb-2"
          >
            1. Download your client-side Python script.
          </h3>
          <p className="pb-4">
            This client-side Python script, generated with a random API key
            unique to you, automatically evaluates whether your MFA, PITR, and
            RLS security controls are in place, identifies and performs
            remediation action flows, and updates your{" "}
            <Link href="/dashboard/security-controls/caa-logs">
              <InlineCode>/dashboard</InlineCode>
            </Link>{" "}
            in real time.
          </p>
          <ClientSideScriptDownload />
        </section>
        <section className="pt-2 pb-4">
          <h3 className="font-semibold pb-2">2. Run Python.</h3>
          <p>Open a terminal and run your Python script.</p>
          <div className="my-4 p-4 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <pre className="font-mono text-sm text-gray-800 dark:text-gray-200">
              <p>python caa_supabase.py</p>
            </pre>
          </div>
        </section>
        <section className="pb-4">
          <h3 className="font-semibold pb-2">3. Results 🎉</h3>
          Now, all your security controls status, remediation action flow
          results, and logs are available in your dashboard, updated in real
          time (refetch every 1 second).
          <div className="flex flex-col md:flex-row gap-2 flex-wrap pt-4">
            <Link href="/dashboard/security-controls/mfa">
              <Button className="active:bg-foreground/10" variant={"default"}>
                MFA (Multi Factor Authentication)
              </Button>
            </Link>
            <Link href="/dashboard/security-controls/pitr">
              <Button className="active:bg-foreground/10" variant={"default"}>
                PITR (Point-In-Time Recovery)
              </Button>
            </Link>
            <Link href="/dashboard/security-controls/rls">
              <Button className="active:bg-foreground/10" variant={"default"}>
                RLS (Row Level Security)
              </Button>
            </Link>
            <Link href="/dashboard/security-controls/evidence-images">
              <Button className="active:bg-foreground/10" variant={"default"}>
                Evidence Images
              </Button>
            </Link>
            <Link href="/dashboard/security-controls/caa-logs">
              <Button className="active:bg-foreground/10" variant={"default"}>
                Logs
              </Button>
            </Link>
          </div>
        </section>
      </article>
    </ScrollArea>
  );
}
