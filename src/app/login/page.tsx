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

  const params = await props.searchParams;
  const SIGNIN_ERROR_URL = "/api/auth/error";
  return (
    // TODO: Once the dashboard is done, put that main components
    // here to the login page and the error page and use opacity
    // and maybe blur. Showing a glimpse of how the dashboard looks like
    // will improve the user experience. Also, the dark mode / light mode button
    // will actually work even in skeleton.
    <div className="min-h-svh min-w-svw flex items-center justify-center backdrop-blur-[1rem]">
      <div className="flex items-center flex-col w-xs rounded-lg border border-gray-200 bg-white p-6 text-center shadow dark:border-gray-600 dark:bg-dark-mode-menu dark:hover:border-gray-500">
        <div className="flex items-center justify-center w-full gap-2">
          <svg
            width="25"
            height="26"
            className="**:fill-light-mode-text-main **:dark:fill-gray-400 **:stroke-0 **:opacity-80 **:hover:opacity-100 **:dark:hover:fill-white **:transition-all **:duration-200"
            viewBox="0 0 25 26"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.208 25.262C23.462 25.262 24.325 24.367 24.325 23.112L24.325 13.685C24.325 10.543 24.259 7.56301 24.357 4.50201C24.406 2.61401 23.25 1.84801 21.671 1.84801C18.593 1.88101 15.516 1.84801 12.422 1.84801L3.58099 1.84801C2.13099 1.84801 1.12199 2.71101 1.12199 3.96501L1.12199 23.145C1.12199 24.35 2.01799 25.245 3.22199 25.245L22.193 25.245L22.208 25.262ZM15.5 4.69801C16.59 5.28401 17.633 5.95101 18.658 6.65201C19.408 7.15601 19.57 8.13301 19.114 8.88201C19.0072 9.07029 18.8643 9.23568 18.6936 9.36871C18.5228 9.50174 18.3275 9.59981 18.1188 9.6573C17.9101 9.71479 17.6921 9.73058 17.4773 9.70376C17.2625 9.67694 17.0551 9.60804 16.867 9.50101C15.81 8.89801 14.8 8.24701 13.774 7.59601C13.285 7.28601 13.057 6.79801 13.057 6.22801C13.057 4.94201 14.36 4.09501 15.5 4.69801ZM4.34599 8.00301C4.34599 6.63501 5.71399 5.85301 6.93599 6.55301C8.62899 7.54701 10.306 8.60501 11.983 9.63101L20.677 14.956C21.361 15.379 21.899 15.884 21.85 16.746C21.768 18.082 20.384 18.766 19.147 18.016C16.525 16.453 13.937 14.842 11.347 13.246C9.36099 12.041 7.39099 10.82 5.40499 9.61501C4.78499 9.24001 4.36299 8.76801 4.34599 8.00301ZM13.774 22.266C12.259 21.386 10.778 20.443 9.27999 19.531C7.65199 18.521 6.00699 17.528 4.39499 16.519C3.31999 15.851 3.02699 14.907 3.59699 14.011C4.13499 13.148 5.12699 12.985 6.15399 13.604C9.23411 15.4968 12.3168 17.3855 15.402 19.27C16.021 19.645 16.444 20.133 16.428 20.898C16.428 22.25 15.028 22.998 13.79 22.282L13.774 22.266Z"
              fill="#000000"
            />
          </svg>
          <label className="text-xl font-bold tracking-tight text-light-mode-text-main dark:text-gray-400 opacity-80 hover:opacity-100 dark:hover:drop-shadow-[0_0.2em_1em_rgba(255,255,255,1)] hover:drop-shadow-[0_0.2em_1em_rgba(0,0,0,1)] transition-all duration-200 select-none dark:hover:text-white">
            caa
          </label>
        </div>
        <form
          className="w-full"
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
          <Input
            className="mb-3 w-full focus-visible:ring-0"
            type="email"
            name="email"
            id="email"
            required={!(process.env.NODE_ENV === "development")}
          />
          <Label className="mb-2" htmlFor="password">
            Password
          </Label>
          <Input
            className="mb-3 w-full focus-visible:ring-0"
            type="password"
            name="password"
            id="password"
            required
          />
          <Button
            className="w-full hover:text-purple-300 ring-purple-400 dark:ring-none hover:shadow-xl hover:ring-2 hover:ring-bg-purple-500  shadow-cyan-700 dark:shadow-none shadow-lg hover:bg-gray-800 dark:hover:bg-white dark:hover:shadow-lg dark:hover:text-purple-800 duration-75"
            type="submit"
          >
            Sign in
          </Button>
        </form>

        {Object.values(providerMap).map((provider) => (
          <form
            className="w-full"
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
              className="mt-3 w-full bg-dark-mode-main/85 hover:bg-dark-mode-main/90 dark:shadow-none shadow-cyan-600 shadow-sm dark:bg-light-mode-text-main/90 dark:text-dark-mode-text-main dark:hover:bg-white/20 duration-0"
              type="submit"
            >
              <div className="flex items-center justify-center w-full gap-2">
                {provider.id.toLowerCase() === "github" && (
                  // SVG's from https://simpleicons.org/ require `stroke-0`.
                  // Otherwise, edges get cut off.
                  <svg
                    role="img"
                    className="fill-light-mode-main dark:fill-dark-mode-text-main size-4 stroke-0"
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
                    className="fill-light-mode-main dark:fill-dark-mode-text-main stroke-0 size-4"
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
