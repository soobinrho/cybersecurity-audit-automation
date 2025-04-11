import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SecurityControlsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  redirect("/dashboard");
}
