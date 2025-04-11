import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getLogs } from "@/lib/getLogs";
import LogsTable from "@/components/dashboard/LogsTable";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Logs",
};

export default async function MFAPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const authentiactedUserId = session.user?.id as string;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["logs"],
    queryFn: () => getLogs(authentiactedUserId),
  });

  return (
    <ScrollArea>
      <article className="px-9 pb-1 pt-7 md:px-16 md:py-9 xl:px-20 xl:py-12 2xl:px-36 2xl:py-18 text-wrap">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SessionProvider>
            <section>
              <h2 className="text-2xl font-bold pb-4">Audit Logs</h2>
              <LogsTable />
            </section>
          </SessionProvider>
        </HydrationBoundary>
      </article>
    </ScrollArea>
  );
}
