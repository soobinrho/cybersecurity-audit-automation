import { auth } from "@/auth";
import SignOutButton from "@/components/auth/SignOutButton";
import DarkModeButton from "@/components/DarkModeButton";
import { redirect } from "next/navigation";

export default async function App() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-lvh w-full">
      <DarkModeButton />
      <SignOutButton />
    </div>
  );
}
