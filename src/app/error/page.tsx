"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  const error = useSearchParams().get("error");

  return (
    <div className="flex min-h-svh min-w-svw flex-col items-center justify-center">
      <Link
        href="/login"
        className="block w-xs rounded-lg border border-gray-200 bg-white p-6 text-center shadow dark:border-gray-600 dark:bg-dark-mode-menu dark:hover:bg-dark-mode-menu/30 dark:hover:border-gray-500"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight">
          {error === "PrototypingPeriod" || error === "CredentialsSignin"
            ? "Access Denied"
            : "Error"}
        </h5>
        <p className="font-normal">
          {error === "PrototypingPeriod"
            ? "Only designated test accounts are allowed at this time."
            : "Click here to try again."}
        </p>
      </Link>
    </div>
  );
}
