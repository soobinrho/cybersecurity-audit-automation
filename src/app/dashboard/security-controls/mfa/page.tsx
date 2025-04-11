import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getUsers } from "@/lib/getUsers";
import MFATable from "@/components/dashboard/MFATable";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "MFA",
};

export default async function MFAPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const authentiactedUserId = session.user?.id as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(authentiactedUserId),
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SessionProvider>
          <section>
            <h2 className="text-2xl font-bold pb-4">
              MFA (Multi Factor Authentication)
            </h2>
            <MFATable />
          </section>
        </SessionProvider>
      </HydrationBoundary>
    </div>
  );
}
