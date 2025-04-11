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
        return {
          // This is a random value just for testing.
          id: "3a8f4c10-d426-43a1-bb72-9f894ff6a52f",  
          name: "Soobin",
          email: String(inputCredential.email),
          image: "https://github.com/soobinrho.png",
        };
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
    error: "/api/auth/error",
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
    // Source:
    //   https://authjs.dev/guides/extending-the-session
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = String(token.id)
      return session
    },
  },
  logger: {
    error(code, ...message) {
      console.log(code, message);
    },
    warn(code, ...message) {
      console.log(code, message);
    },
  },
});
