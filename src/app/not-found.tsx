"use client";

import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex min-h-svh min-w-svw flex-col items-center justify-center">
      <Link
        href="/"
        className="block w-xs rounded-lg border border-gray-200 bg-white p-6 text-center shadow dark:border-gray-600 dark:bg-dark-mode-menu dark:hover:border-gray-500"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight">
          404
        </h5>
        <p className="font-normal">Page Not Found</p>
      </Link>
    </div>
  );
}
