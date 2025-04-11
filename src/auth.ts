import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";

const providers: Provider[] = [GitHub, Google];
const TEST_LOGIN_USER = process.env.TEST_LOGIN_USER || "";
const TEST_LOGIN_PASS = process.env.TEST_LOGIN_PASS || "";
if (TEST_LOGIN_PASS && TEST_LOGIN_PASS !== "") {
  providers.push(
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(inputCredential) {
        if (inputCredential.password !== TEST_LOGIN_PASS) {
          return null;
        }
        if (process.env.NODE_ENV === "production") {
          if (inputCredential.email !== TEST_LOGIN_USER) {
            return null;
          }
        }
        const testCredential = {
          id: "eb9f6e29-3862-470c-b5de-bd430b07c9b4",
          name: "Soobin",
          email: String(inputCredential.email),
        };
        return testCredential;
      },
    })
  );
}

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    error: "/error",
    signIn: "/login",
  },
  callbacks: {
    // For prototyping purpose, restrict the access to only
    // the test accounts.
    signIn({ user }) {
      if (process.env.NODE_ENV !== "development") {
        if (String(user.email) !== process.env.TEST_LOGIN_USER) {
          return false;
        }
      }
      return true;
    },
    // This code explicity makes the user's id included in the session object.
    // Commented out until prototyping period is complete.
    // Source:
    //   https://authjs.dev/guides/extending-the-session
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = String(token.id);
      return session;
    },
  },
  logger: {
    error(code, ...message) {
      console.log("[Auth.js ERROR] ", code, message);
    },
    warn(code, ...message) {
      console.log("[Auth.js WARN] ", code, message);
    },
    debug(code, ...message) {
      console.log("[Auth.js DEBUG] ", code, message);
    },
  },
});
