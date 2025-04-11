import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PITR",
};

export default async function PITRPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <article>
      <h2>PITR (Point-In-Time Recovery)</h2>
    </article>
  );
}
