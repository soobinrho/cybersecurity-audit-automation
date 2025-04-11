"use client";

import React from "react";
import SidebarHeaderTwo from "@/components/dashboard/SidebarHeaderTwo";
import SidebarItem from "@/components/dashboard/SidebarItem";
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
    <div className={`${className}` + " " + "hidden md:block py-4 md:py-4"}>
      {isDashboard ? (
        <div>
          <SidebarHeaderTwo href="/dashboard/supabase">
            Supabase
          </SidebarHeaderTwo>
          <div className="flex flex-col leading-6 gap-0.5 w-full h-full px-0.5 pb-4">
            <SidebarItem href="/dashboard/supabase/getting-started">
              Getting Started
            </SidebarItem>
            <SidebarItem href="/dashboard/supabase/mfa">MFA</SidebarItem>
            <SidebarItem href="/dashboard/supabase/pitr">PITR</SidebarItem>
            <SidebarItem href="/dashboard/supabase/rls">RLS</SidebarItem>
            <SidebarItem href="/dashboard/supabase/evidence-images">
              Evidence Images
            </SidebarItem>
            <SidebarItem href="/dashboard/supabase/audit-logs">
              Audit Logs
            </SidebarItem>
          </div>

          <SidebarHeaderTwo href="/dashboard/aws">AWS</SidebarHeaderTwo>
          <div className="flex flex-col leading-6 gap-0.5 w-full h-full px-0.5 pb-4">
            <SidebarItem href="/dashboard/aws/getting-started">
              Getting Started
            </SidebarItem>
          </div>

          <SidebarHeaderTwo href="/dashboard/gcp">GCP</SidebarHeaderTwo>
          <div className="flex flex-col leading-6 gap-0.5 w-full h-full px-0.5 pb-4">
            <SidebarItem href="/dashboard/gcp/getting-started">
              Getting Started
            </SidebarItem>
          </div>

          <SidebarHeaderTwo href="/dashboard/azure">Azure</SidebarHeaderTwo>
          <div className="flex flex-col leading-6 gap-0.5 w-full h-full px-0.5 pb-4">
            <SidebarItem href="/dashboard/azure/getting-started">
              Getting Started
            </SidebarItem>
          </div>

          <SidebarHeaderTwo href="/dashboard/hetzner">Hetzner</SidebarHeaderTwo>
          <div className="flex flex-col leading-6 gap-0.5 w-full h-full px-0.5 pb-4">
            <SidebarItem href="/dashboard/hetzner/getting-started">
              Getting Started
            </SidebarItem>
          </div>

          <SidebarHeaderTwo href="/dashboard/vercel">Vercel</SidebarHeaderTwo>
          <div className="flex flex-col leading-6 gap-0.5 w-full h-full px-0.5 pb-4">
            <SidebarItem href="/dashboard/vercel/getting-started">
              Getting Started
            </SidebarItem>
          </div>
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
