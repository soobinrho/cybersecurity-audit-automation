import { signIn, signOut } from "@/auth";

export default function Home() {
  signIn()
  return (
    <>
      <form
        action={async () => {
          "use server"
          await signIn()
        }}
      >
        <button>Sign In</button>
      </form>
      {/* Dashboard */}
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
        className="w-full"
      >
        <button>
          Sign Out
        </button>
      </form>
    </>
  );
}
