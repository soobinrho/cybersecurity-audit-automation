import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";

const title = "GCP";
export const metadata: Metadata = {
  title: title,
  openGraph: {
    title: title,
  },
  twitter: {
    title: title,
  },
};

export default async function GettingStartedPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <ScrollArea>
      <article className="px-9 pb-1 pt-7 md:px-16 md:py-9 xl:px-20 xl:py-12 2xl:px-36 2xl:py-18 text-pretty leading-loose">
        <h2 className="text-2xl font-bold pb-4">Getting Started</h2>
        <section className="pb-4">
          <p className="pb-4">
            Please feel free to contribute to{" "}
            <a
              href="https://github.com/soobinrho/cybersecurity-audit-automation"
              className="font-medium visited:font-normal active:font-normal"
              target="_blank"
            >
              https://github.com/soobinrho/cybersecurity-audit-automation
            </a>
          </p>
        </section>
      </article>
    </ScrollArea>
  );
}
