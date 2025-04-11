"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationBarLeft() {
  const pathname = usePathname().toLowerCase();
  const isLLM = pathname.startsWith("/dashboard/chat");
  let isDashboard;
  if (!isLLM) {
    isDashboard = pathname.startsWith("/dashboard");
  }

  return (
    <span className="flex gap-3 md:gap-4 justify-center md:justify-start items-center text-nowrap text-sm md:text-base tracking-tighter md:tracking-tight">
      <Link href="/dashboard" className="flex gap-2 items-center pr-0 md:pr-1">
        <svg
          className="hidden md:block h-6 **:fill-light-mode-text-main **:dark:fill-gray-400 **:stroke-0 **:opacity-80 **:hover:opacity-100 **:dark:hover:fill-white **:transition-all **:duration-200 active:h-7 transition-all"
          viewBox="0 0 25 26"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.208 25.262C23.462 25.262 24.325 24.367 24.325 23.112L24.325 13.685C24.325 10.543 24.259 7.56301 24.357 4.50201C24.406 2.61401 23.25 1.84801 21.671 1.84801C18.593 1.88101 15.516 1.84801 12.422 1.84801L3.58099 1.84801C2.13099 1.84801 1.12199 2.71101 1.12199 3.96501L1.12199 23.145C1.12199 24.35 2.01799 25.245 3.22199 25.245L22.193 25.245L22.208 25.262ZM15.5 4.69801C16.59 5.28401 17.633 5.95101 18.658 6.65201C19.408 7.15601 19.57 8.13301 19.114 8.88201C19.0072 9.07029 18.8643 9.23568 18.6936 9.36871C18.5228 9.50174 18.3275 9.59981 18.1188 9.6573C17.9101 9.71479 17.6921 9.73058 17.4773 9.70376C17.2625 9.67694 17.0551 9.60804 16.867 9.50101C15.81 8.89801 14.8 8.24701 13.774 7.59601C13.285 7.28601 13.057 6.79801 13.057 6.22801C13.057 4.94201 14.36 4.09501 15.5 4.69801ZM4.34599 8.00301C4.34599 6.63501 5.71399 5.85301 6.93599 6.55301C8.62899 7.54701 10.306 8.60501 11.983 9.63101L20.677 14.956C21.361 15.379 21.899 15.884 21.85 16.746C21.768 18.082 20.384 18.766 19.147 18.016C16.525 16.453 13.937 14.842 11.347 13.246C9.36099 12.041 7.39099 10.82 5.40499 9.61501C4.78499 9.24001 4.36299 8.76801 4.34599 8.00301ZM13.774 22.266C12.259 21.386 10.778 20.443 9.27999 19.531C7.65199 18.521 6.00699 17.528 4.39499 16.519C3.31999 15.851 3.02699 14.907 3.59699 14.011C4.13499 13.148 5.12699 12.985 6.15399 13.604C9.23411 15.4968 12.3168 17.3855 15.402 19.27C16.021 19.645 16.444 20.133 16.428 20.898C16.428 22.25 15.028 22.998 13.79 22.282L13.774 22.266Z"
            fill="#000000"
          />
        </svg>
        <label className="hidden md:block text-xl font-bold tracking-tight text-light-mode-text-main dark:text-gray-400 opacity-80 hover:opacity-100 dark:hover:drop-shadow-[0_0.2em_1em_rgba(255,255,255,1)] hover:drop-shadow-[0_0.2em_1em_rgba(0,0,0,1)] transition-all duration-200 dark:hover:text-white cursor-pointer active:text-lg">
          caa
        </label>
      </Link>
      <Link
        href="/dashboard"
        className={`select-none text-foreground/70 transition-all duration-75 ${
          isDashboard ? "font-bold" : ""
        }`}
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/chat"
        className={`select-none text-foreground/70 transition-all duration-75 ${
          isLLM ? "font-bold" : ""
        }`}
      >
        LLM for Security
      </Link>
      <a
        href="https://github.com/soobinrho/caa-supabase"
        target="_blank"
        className="select-none text-foreground/70 active:font-bold transition-all duration-75"
      >
        Documentation
      </a>
    </span>
  );
}
