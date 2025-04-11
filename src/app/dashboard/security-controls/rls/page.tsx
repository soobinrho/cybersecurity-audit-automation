import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RLS",
};

export default async function RLSPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <article>
      <h2>RLS (Row Level Security)</h2>
    </article>
  );
}
