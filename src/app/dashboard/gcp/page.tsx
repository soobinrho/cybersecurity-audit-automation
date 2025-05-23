import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

const title = "GCP";
export const metadata: Metadata = {
  title: title,
  openGraph: {
    title: title,
  },
  twitter: {
    title: title,
  },
};

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  redirect("/dashboard/gcp/getting-started");
}
