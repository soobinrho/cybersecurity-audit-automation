import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'LLM for Security',
}

export default async function App() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  // TODO: Remove redirect after completing Chat component.
  redirect("/dashboard");

  return <div></div>;
}
