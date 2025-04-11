import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM for Security",
};

export default async function ChatPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return <div>Chat!</div>;
}
