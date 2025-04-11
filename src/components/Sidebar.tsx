"use client";

import React from "react";
import SidebarHeaderTwo from "@/components/SidebarHeaderTwo";
import SidebarItem from "@/components/SidebarItem";
import { usePathname } from "next/navigation";

interface props {
  className?: string;
}

export default function Sidebar(props: props) {
  const { className } = props;
  const pathname = usePathname().toLowerCase();
  const isChat = pathname === "/dashboard/chat";
  const isDashboard = !isChat && pathname.startsWith("/dashboard");
  return (
    <div
      className={`${className}` + " " + "hidden md:block h-svh py-4 md:py-4"}
    >
      {isDashboard ? (
        <div>
          <SidebarHeaderTwo href="/dashboard">Dashboard</SidebarHeaderTwo>
          <div className="flex flex-col leading-6 gap-0.5 w-full h-full px-0.5">
            <SidebarItem href="/dashboard">Getting Started</SidebarItem>
            <SidebarItem href="/dashboard/security-controls/mfa">
              MFA
            </SidebarItem>
            <SidebarItem href="/dashboard/security-controls/pitr">
              PITR
            </SidebarItem>
            <SidebarItem href="/dashboard/security-controls/rls">
              RLS
            </SidebarItem>
          </div>
          <div className="pb-4"></div>
        </div>
      ) : (
        <></>
      )}
      {isChat ? (
        <div>
          <SidebarHeaderTwo href="/dashboard/chat">
            LLM for Security
          </SidebarHeaderTwo>
          <div className="flex flex-col leading-6 gap-0.5 w-full h-full px-0.5">
            <SidebarItem href="/dashboard/chat">Chat</SidebarItem>
          </div>
          <div className="pb-4"></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
