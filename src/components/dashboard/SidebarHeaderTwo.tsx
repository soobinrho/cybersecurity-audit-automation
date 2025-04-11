"use client";

import React from "react";
import Link from "next/link";

interface props {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export default function SidebarHeaderTwo(props: props) {
  const { children, href, className } = props;
  return (
    <>
      <Link href={href}>
        <h2
          className={`${className} font-bold pb-2 active:font-extrabold text-nowrap overflow-x-hidden px-[0.65rem]`}
        >
          {children}
        </h2>
      </Link>
    </>
  );
}
