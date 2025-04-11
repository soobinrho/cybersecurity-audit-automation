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
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SessionProvider>
          <section>
            <h2 className="text-2xl font-bold pb-4">caa Logs</h2>
            <LogsTable />
          </section>
        </SessionProvider>
      </HydrationBoundary>
    </div>
  );
}
