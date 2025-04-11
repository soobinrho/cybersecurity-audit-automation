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
      <Link
        href="/dashboard"
        className="hidden invisible md:visible md:flex gap-2 items-center pr-0 md:pr-1"
      >
        {/* SVG logo here if I decided to make one. */}
        <svg role="img" viewBox="0 0 36 36" className="w-5 md:pt-0.5">
          <path
            fill="#662113"
            d="M7.317 11c-5.723 9.083.958 18 .958 18s2.874-.442 6.875-5.2S7.317 11 7.317 11m21.342 0c5.723 9.083-.958 18-.958 18s-2.874-.442-6.875-5.2S28.659 11 28.659 11"
          />
          <path
            fill="#FFAC33"
            d="M15.203 31.557a1.2 1.2 0 0 0-.531-.496c-2.032-2.172-.589-4.717-.589-4.717 0-.703 1.271-2.544 0-2.544l-1.272 1.272c-1.272 1.271-1.272 5.089-1.272 5.089H8.995a1.27 1.27 0 1 0 0 2.543h1.408l-.282.153a1.274 1.274 0 0 0 1.21 2.24l3.357-1.816a1.274 1.274 0 0 0 .515-1.724m5.596 0c.123-.229.317-.384.53-.496 2.033-2.172.589-4.717.589-4.717 0-.703-1.271-2.544 0-2.544l1.272 1.272c1.273 1.271 1.273 5.089 1.273 5.089h2.544a1.27 1.27 0 0 1 1.271 1.272 1.27 1.27 0 0 1-1.271 1.271h-1.408l.281.153a1.273 1.273 0 1 1-1.211 2.24l-3.356-1.816a1.27 1.27 0 0 1-.514-1.724"
          />
          <path
            fill="#662113"
            d="M28.278 11.292c2.891-6.092 0-10.542 0-10.542s-5.781.959-6.744 2.875c-1.219 2.424 6.744 7.667 6.744 7.667"
          />
          <path
            fill="#662113"
            d="M29.562 12.738c0 10.297-3.152 20.595-11.562 20.595S6.437 23.035 6.437 12.738C6.437 2.44 11.614 2.083 18 2.083s11.562.357 11.562 10.655"
          />
          <path
            fill="#C1694F"
            d="M27.666 17.738c0 10.297-7.774 14.595-9.666 14.595s-9.666-4.298-9.666-14.595 19.332-10.298 19.332 0"
          />
          <path
            fill="#662113"
            d="M7.722 11.292C4.831 5.2 7.722.75 7.722.75s5.782.959 6.746 2.875c1.218 2.424-6.746 7.667-6.746 7.667"
          />
          <path
            fill="#C1694F"
            d="M14.929 4.373C10.702 2.789 7.722.75 7.722.75s-2.076 3.221-.928 7.926c.446 2.137 1.94 4.195 3.904 4.662 2.637.627 7.302-.049 7.302-3.963 0-2.695-1.074-4.252-3.071-5.002m6.142 0C25.298 2.789 28.277.75 28.277.75s2.076 3.221.928 7.926c-.445 2.137-1.939 4.195-3.902 4.662-2.638.627-7.303-.049-7.303-3.963 0-2.695 1.074-4.252 3.071-5.002"
          />
          <path
            fill="#FFD983"
            d="M16.083 8.417a3.833 3.833 0 1 1-7.666 0 3.833 3.833 0 0 1 7.666 0m11.5 0a3.833 3.833 0 1 1-7.666 0 3.833 3.833 0 0 1 7.666 0"
          />
          <path
            fill="#292F33"
            d="M14.167 8.417a1.917 1.917 0 1 1-3.833 0 1.917 1.917 0 0 1 3.833 0m11.5 0a1.917 1.917 0 1 1-3.833 0 1.917 1.917 0 0 1 3.833 0"
          />
          <path
            fill="#FFCC4D"
            d="M20.875 12.729c0 2.382-2.875 3.354-2.875 3.354s-2.875-.973-2.875-3.354S18 9.375 18 9.375s2.875.972 2.875 3.354"
          />
          <path
            fill="#F4900C"
            d="M20.875 12.729c0 2.382-2.875 3.354-2.875 3.354s-2.875-.973-2.875-3.354C16.323 13.927 18 14.167 18 14.167s1.677-.24 2.875-1.438"
          />
        </svg>

        <label className="text-xl font-bold tracking-tight text-light-mode-text-main dark:text-gray-400 opacity-80 hover:opacity-100 dark:hover:drop-shadow-[0_0.2em_1em_rgba(255,255,255,1)] hover:drop-shadow-[0_0.2em_0.7em_rgba(0,0,0,1)] transition-all duration-200 dark:hover:text-white cursor-pointer md:pb-0.5">
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
