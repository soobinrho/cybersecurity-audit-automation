import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import {v4 as uuidv4} from 'uuid';

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize(inputCredential) {
      if (inputCredential.password !== process.env.TEST_LOGIN_PASS) {
        return null;
      }
      if (process.env.NODE_ENV !== "development") {
        if (inputCredential.email !== process.env.TEST_LOGIN_USER) {
          return null;
        }
      }
      return {
        id: uuidv4(),
        name: "Soobin",
        email: String(inputCredential.email),
        image: "https://github.com/soobinrho.png",
      };
    },
  }),
  GitHub,
  Google,
];

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
  // debug: process.env.NODE_ENV === "development" ? true : false,
  pages: {
    error: "/api/auth/error",
    signIn: "/login"
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
  },
  logger: {
    error(code, ...message) {
      console.log(code, message);
    },
    warn(code, ...message) {
      console.log(code, message);
    },
    // debug(code, ...message) {
    //   console.log(code, message);
    // },
  },
});
