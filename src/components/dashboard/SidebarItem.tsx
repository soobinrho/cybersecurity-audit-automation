"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

interface props {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export default function SidebarItem(props: props) {
  const { children, href, className } = props;
  const pathname = usePathname().toLowerCase();
  const isActive = pathname == href;

  return (
    <>
      <Link href={href}>
        <Button
          variant="ghost"
          className={`${className} w-full justify-start font-normal overflow-clip px-2 dark:text-xs ${
            isActive ? "font-bold bg-accent" : ""
          }`}
        >
          {children}
        </Button>
      </Link>
    </>
  );
}
