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
import { ScrollArea } from "@/components/ui/scroll-area";

const title = "MFA";
export const metadata: Metadata = {
  title: title,
  openGraph: {
    title: title,
  },
  twitter: {
    title: title,
  },
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
    <ScrollArea>
      <article className="px-9 pb-1 pt-7 md:px-16 md:py-9 xl:px-20 xl:py-12 2xl:px-36 2xl:py-18 text-wrap">
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
      </article>
    </ScrollArea>
  );
}
