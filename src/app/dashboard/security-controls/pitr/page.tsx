import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getProjects } from "@/lib/getProjects";
import PITRTable from "@/components/dashboard/PITRTable";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "PITR",
};

export default async function PITRPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const authentiactedUserId = session.user?.id as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(authentiactedUserId),
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SessionProvider>
          <section>
            <h2 className="text-2xl font-bold pb-4">
              PITR (Point-In-Time Recovery)
            </h2>
            <PITRTable />
          </section>
        </SessionProvider>
      </HydrationBoundary>
    </div>
  );
}
