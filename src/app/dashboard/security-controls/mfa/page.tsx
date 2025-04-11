import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MFA",
};

export default async function MFAPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <article>
      <h2>MFA (Multi Factor Authentication)</h2>
    </article>
  );
}
