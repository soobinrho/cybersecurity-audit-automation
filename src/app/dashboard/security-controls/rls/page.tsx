import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getTables } from "@/lib/getTables";
import RLSTable from "@/components/dashboard/RLSTable";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "RLS",
};

export default async function RLSPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const authentiactedUserId = session.user?.id as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["tables"],
    queryFn: () => getTables(authentiactedUserId),
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SessionProvider>
          <section>
            <h2 className="text-2xl font-bold pb-4">
              RLS (Row Level Security)
            </h2>
            <RLSTable />
          </section>
        </SessionProvider>
      </HydrationBoundary>
    </div>
  );
}
