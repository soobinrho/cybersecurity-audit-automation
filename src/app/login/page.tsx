import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  const params = (await props.searchParams);
  const SIGNIN_ERROR_URL = "/api/auth/error";
  return (
    <div className="flex min-h-lvh w-full flex-col items-center justify-center">
      <div className="block w-xs rounded-lg border border-gray-200 bg-white p-6 text-center shadow dark:border-gray-600 dark:bg-dark-mode-menu dark:hover:border-gray-500">
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight">
          caa
        </h5>
        <form
          action={async (formData) => {
            "use server";
            try {
              await signIn("credentials", formData);
            } catch (error) {
              if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
              }
              throw error;
            }
          }}
        >
          <Label className="mb-2" htmlFor="email">
            Email
          </Label>
          <Input className="mb-3" type="email" name="email" id="email" required={!(process.env.NODE_ENV === "development")} />
          <Label className="mb-2" htmlFor="password">
            Password
          </Label>
          <Input
            className="mb-3"
            type="password"
            name="password"
            id="password"
            required
          />
          <Button
            className="w-full hover:text-purple-300 ring-purple-400 dark:ring-none hover:shadow-xl hover:ring-2 hover:ring-bg-purple-500  shadow-cyan-700 dark:shadow-none shadow-lg hover:bg-gray-800 dark:hover:bg-white dark:hover:shadow-lg dark:hover:text-purple-800"
            type="submit"
          >
            Sign in
          </Button>
        </form>

        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              "use server";
              try {
                // During prototyping period, I'll allow only test accounts.
                if (true) {
                  return redirect(
                    `${SIGNIN_ERROR_URL}?error=PrototypingPeriod`
                  );
                }
                await signIn(provider.id, {
                  redirectTo: params.callbackUrl ?? "",
                });
              } catch (error) {
                // Signin can fail for a number of reasons, such as the user
                // not existing, or the user not having the correct role.
                // In some cases, you may want to redirect to a custom error
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
                }

                // Otherwise if a redirects happens Next.js can handle it
                // so you can just re-thrown the error and let Next.js handle it.
                // Docs:
                // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                throw error;
              }
            }}
          >
            <Button
              className="mt-3 w-full dark:shadow-none shadow-cyan-600 shadow-sm dark:bg-light-mode-text-main/90 dark:text-dark-mode-text-main dark:hover:bg-white/20" type="submit"
            >
              <div className="flex items-center justify-center w-full gap-2">
                {provider.id.toLowerCase() === "github" && (
                  <svg
                    role="img"
                    className="fill-light-mode-main dark:fill-dark-mode-text-main"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                )}
                {provider.id.toLowerCase() === "google" && (
                  <svg
                    role="img"
                    className="fill-light-mode-main dark:fill-dark-mode-text-main"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Google</title>
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                )}

                <span>Sign in with {provider.name} </span>
              </div>
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
