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
        {/* SVG logo here if I decided to make one. */}
        <label className="hidden md:block text-xl font-bold tracking-tight text-light-mode-text-main dark:text-gray-400 opacity-80 hover:opacity-100 dark:hover:drop-shadow-[0_0.2em_1em_rgba(255,255,255,1)] hover:drop-shadow-[0_0.2em_0.7em_rgba(0,0,0,1)] transition-all duration-200 dark:hover:text-white cursor-pointer md:pb-0.5">
          Cybersecurity Audit Automation
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
        href="https://github.com/soobinrho/cybersecurity-audit-automation"
        target="_blank"
        className="select-none text-foreground/70 active:font-bold transition-all duration-75"
      >
        Documentation
      </a>
    </span>
  );
}
