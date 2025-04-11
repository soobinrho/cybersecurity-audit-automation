import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getEvidenceImages } from "@/lib/getEvidenceImages";
import EvidenceImagesTable from "@/components/dashboard/EvidenceImagesTable";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Evidence Images",
};

export default async function EvidenceImagesPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const authentiactedUserId = session.user?.id as string;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["evidence-images"],
    queryFn: () => getEvidenceImages(authentiactedUserId),
  });
  return (
    <ScrollArea>
      <article className="px-9 pb-1 pt-7 md:px-16 md:py-9 xl:px-20 xl:py-12 2xl:px-36 2xl:py-18 text-wrap">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SessionProvider>
            <section>
              <h2 className="text-2xl font-bold pb-4">Evidence Images</h2>
              <EvidenceImagesTable />
            </section>
          </SessionProvider>
        </HydrationBoundary>
      </article>
    </ScrollArea>
  );
}
