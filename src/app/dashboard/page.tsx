import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

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
      <p>[Main content based on the page]</p>
      <h2>1. Getting Started</h2>
      <p>Download your secure client-side Python script.</p>
      <h3>Linux and Windows</h3>
      <Button className="">Download</Button>
      <p>
        2. [This is generated at server side at request, not at build time] Load
        the template python script using
        https://vercel.com/guides/loading-static-file-nextjs-api-route 3. Serve
        the populated python script using Create Object URL API.
        https://jsfiddle.net/UselessCode/qm5AG/
      </p>
      <p>
        This file is your own unique Python script, which has just been baked in
        by our server to contain a disposable API key with access rights to
        update your dashboard. Thus, your file should be kept in a trusted
        environment. Everytime you click the Downlaod button, a new disposable
        API key gets issued, and the previous API key gets revoked.
      </p>
      <h3>2. Run Python</h3>
      <p>Open a terminal and run your client-side Python script.</p>
      <div>[Code block on how]</div>
      <div>
        [Accordion][If expanded, show a code block with instructions on how to
        install Python]
      </div>
      <p>
        The script checks the status of all security cotrols and run remediation
        action flows. Your dashboard will get updated in real-time with the
        security controls status and remediation results.
      </p>
      <h3>3. Results</h3>
      Now, all security controls status information will be available here.
      <div>
        <Link href="/dashboard/security-controls/mfa">
          <Button variant={"secondary"}>
            MFA (Multi Factor Authentication)
          </Button>
        </Link>
        <Link href="/dashboard/security-controls/pitr">
          <Button variant={"secondary"}>PITR (Point-In-Time Recovery)</Button>
        </Link>
        <Link href="/dashboard/security-controls/rls">
          <Button variant={"secondary"}>RLS (Row Level Security)</Button>
        </Link>
      </div>
    </>
  );
}

// {/* For MFA (Multi Factor Authentication), PITR (Point-In-Time
// Recovery), and RLS (Row Level Security)
// <p>[https://ui.shadcn.com/docs/components/data-table]</p>
// <p>
//   Allow the user to delete any item, or edit, but not add.
//   Adding should only be done via the client side Python program.
// </p> */}
