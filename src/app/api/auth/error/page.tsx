"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const error = (useSearchParams()).get("error")

  return (
    <div className="flex h-lvh w-full flex-col items-center justify-center">
      <Link
        href="/"
        className="block w-xs rounded-lg border border-gray-200 bg-white p-6 text-center shadow dark:border-gray-600 dark:bg-dark-mode-menu dark:hover:bg-dark-mode-menu/30 dark:hover:border-gray-500"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight">
          {error === "PrototypingPeriod" ? "Access Denied" : "Sign-in Error"}
        </h5>
        <p className="font-normal">
          {error === "PrototypingPeriod" ? "Only designated test accounts are allowed at this time." : "Click here to try again."}
          
        </p>
      </Link>
    </div>
  );
}
