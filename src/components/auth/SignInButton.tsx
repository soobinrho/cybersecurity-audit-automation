import { signIn } from "@/auth";
import { Button } from "../ui/button";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button className="dark:shadow-none shadow-cyan-600 shadow-sm dark:bg-light-mode-text-main/90 dark:text-dark-mode-text-main dark:hover:bg-white/20 duration-75 cursor-pointer">
        Sign in
      </Button>
    </form>
  );
}
