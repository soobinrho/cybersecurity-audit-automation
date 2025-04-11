import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { getUsers } from "@/lib/getUsers";
import { getProjects } from "@/lib/getProjects";
import { getTables } from "@/lib/getTables";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const title = "LLM for Security";
export const metadata: Metadata = {
  title: title,
  openGraph: {
    title: title,
  },
  twitter: {
    title: title,
  },
};

export default async function ChatPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const authentiactedUserId = session.user?.id || "";

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(authentiactedUserId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(authentiactedUserId),
  });
  await queryClient.prefetchQuery({
    queryKey: ["tables"],
    queryFn: () => getTables(authentiactedUserId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SessionProvider>
        <ChatInterface />
      </SessionProvider>
    </HydrationBoundary>
  );
}
