"use client";

import { usePathname } from "next/navigation";

interface props {
  className?: string;
}
export default function Footer(props: props) {
  const { className } = props;
  const pathname = usePathname().toLowerCase();
  const isLLM = pathname.startsWith("/dashboard/chat");

  return (
    <div className="hidden md:block">
      <div
        className={
          `${className} ${isLLM && "hidden"}` +
          " " +
          "text-foreground/20 w-full justify-center align-middle flex gap-2 sm:gap-5 text-[0.5rem] md:text-xs tracking-tight sm:tracking-wide pt-2 text-foregroud/60 text-nowrap overflow-hidden md:border-l-[0.08rem] border-dashed"
        }
      >
        <a href="https://github.com/soobinrho/" target="_blank">
          GitHub
        </a>
        <span className="pointer-events-none">|</span>
        <a
          href="https://docs.google.com/document/d/18YrIjcEnB00vqx2RoJ0TYJsbo9TvIh0lkoQddvJsIhU/edit?usp=sharing"
          target="_blank"
        >
          Resume
        </a>
        <span className="pointer-events-none">|</span>
        <a href="https://www.linkedin.com/in/soobinrho/" target="_blank">
          LinkedIn
        </a>
        <span className="pointer-events-none">|</span>

        <a href="https://github.com/soobinrho/caa-supabase" target="_blank">
          © 2025 caa, Soobin Rho.
        </a>
      </div>
    </div>
  );
}
