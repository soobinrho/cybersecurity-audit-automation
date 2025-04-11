import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  redirect("/dashboard/gcp/getting-started");
}
