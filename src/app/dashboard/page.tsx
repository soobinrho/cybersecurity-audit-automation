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

  const url = process.env.NEXT_PUBLIC_URL || "";

  // TODO: Abstract these into components. // Learn from Supabase github on
  // best practices for components.
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
            This client-side Python script first checks if your MFA, PITR, and
            RLS security controls are in place; identifies and performs
            remediation action flows; and sends the results to{" "}
            <a href={`${url}/api/v1/logs`}>
              <InlineCode>{`${url}/api/v1/...`}</InlineCode>
            </a>{" "}
            endpoints such that your{" "}
            <Link href="/dashboard/security-controls/caa-logs">
              <InlineCode>dashboard</InlineCode>
            </Link>{" "}
            gets updated in real time.
          </p>
          <ClientSideScriptDownload />
        </section>
        <section className="pt-2 pb-4">
          <h3 className="font-semibold pb-2">2. Run Python</h3>
          <p>Open a terminal and run your Python script.</p>
          <div className="my-4 p-4 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <pre className="font-mono text-sm text-gray-800 dark:text-gray-200">
              <code>python3 caa_supabase_uid_&lt;your_uid&gt;.py</code>
            </pre>
          </div>
        </section>
        <section className="pb-4">
          <h3 className="font-semibold pb-2">3. Results 🎉</h3>
          Now, all your security controls status information, findings,
          remediation action flow results, and logs are available here.
          <div className="flex flex-col md:flex-row gap-2 flex-wrap pt-4">
            <Link href="/dashboard/security-controls/mfa">
              <Button variant={"secondary"}>
                MFA (Multi Factor Authentication)
              </Button>
            </Link>
            <Link href="/dashboard/security-controls/pitr">
              <Button variant={"secondary"}>
                PITR (Point-In-Time Recovery)
              </Button>
            </Link>
            <Link href="/dashboard/security-controls/rls">
              <Button variant={"secondary"}>RLS (Row Level Security)</Button>
            </Link>
            <Link href="/dashboard/security-controls/evidence-images">
              <Button variant={"secondary"}>Evidence Images</Button>
            </Link>
            <Link href="/dashboard/security-controls/caa-logs">
              <Button variant={"secondary"}>Logs</Button>
            </Link>
          </div>
        </section>
      </article>
    </ScrollArea>
  );
}

// {/* For MFA (Multi Factor Authentication), PITR (Point-In-Time
// Recovery), and RLS (Row Level Security)
// <p>[https://ui.shadcn.com/docs/components/data-table]</p>
// <p>
//   Allow the user to delete any item, or edit, but not add.
//   Adding should only be done via the client side Python program.
// </p> */}
