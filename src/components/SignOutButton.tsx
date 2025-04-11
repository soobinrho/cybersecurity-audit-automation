import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

export default function SignOutButton({
  className,
  size,
  variant,
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <form
      className="inline"
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <Button className={className} size={size} variant={variant}>
        Sign Out
      </Button>
    </form>
  );
}
