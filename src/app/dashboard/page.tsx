import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

const title = "Dashboard";
export const metadata: Metadata = {
  title: title,
  openGraph: {
    title: title,
  },
  twitter: {
    title: title,
  },
};

export default async function App() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  redirect("/dashboard/supabase");
}
