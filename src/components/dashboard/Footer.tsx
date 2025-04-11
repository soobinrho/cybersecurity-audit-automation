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
    <div>
      <div
        className={
          `${className} ${isLLM && "hidden"}` +
          " " +
          "w-full h-full justify-center align-middle flex gap-2 sm:gap-5 text-xs md:text-sm tracking-tight sm:tracking-wide py-4 text-foregroud/60 text-nowrap overflow-hidden md:border-l-[0.08rem] border-dashed"
        }
      >
        <a
          className="hover:text-foreground/80 active:text-muted-foreground dark:active:text-foreground"
          href="https://github.com/soobinrho/"
          target="_blank"
        >
          GitHub
        </a>
        <span className="pointer-events-none">|</span>
        <a
          className="hover:text-foreground/80 active:text-muted-foreground dark:active:text-foreground"
          href="https://docs.google.com/document/d/18YrIjcEnB00vqx2RoJ0TYJsbo9TvIh0lkoQddvJsIhU/edit?usp=sharing"
          target="_blank"
        >
          Resume
        </a>
        <span className="pointer-events-none">|</span>
        <a
          className="hover:text-foreground/80 active:text-muted-foreground dark:active:text-foreground"
          href="https://www.linkedin.com/in/soobinrho/"
          target="_blank"
        >
          LinkedIn
        </a>
        <span className="pointer-events-none">|</span>

        <a
          className="hover:text-foreground/80 active:text-muted-foreground dark:active:text-foreground"
          href="https://github.com/soobinrho/caa-supabase"
          target="_blank"
        >
          © 2025 caa, Soobin Rho.
        </a>
      </div>
    </div>
  );
}
