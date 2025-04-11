"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function MobileMenu() {
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="size-9 rounded-sm flex justify-center align-middle items-center hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-100/50 dark:hover:text-neutral-50 dark:dark:hover:bg-neutral-800/50">
          <Menu className="stroke-[0.06rem] stroke-foreground/50" />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <DrawerClose>
                <DrawerTitle>Dashboard</DrawerTitle>
              </DrawerClose>
            </Link>
            <div className="flex flex-col gap-3 mb-3">
              <DrawerDescription>
                <Link href="/dashboard">
                  <DrawerClose>Getting Started</DrawerClose>
                </Link>
              </DrawerDescription>
              <DrawerDescription>
                <Link href="/dashboard/security-controls/mfa">
                  <DrawerClose>MFA</DrawerClose>
                </Link>
              </DrawerDescription>
              <DrawerDescription>
                <Link href="/dashboard/security-controls/pitr">
                  <DrawerClose>PITR</DrawerClose>
                </Link>
              </DrawerDescription>
              <DrawerDescription>
                <Link href="/dashboard/security-controls/rls">
                  <DrawerClose>RLS</DrawerClose>
                </Link>
              </DrawerDescription>
              <DrawerDescription>
                <Link href="/dashboard/security-controls/caa-logs">
                  <DrawerClose>caa Logs</DrawerClose>
                </Link>
              </DrawerDescription>
            </div>
            <Link href="/dashboard/chat">
              <DrawerClose>
                <DrawerTitle>LLM for Security</DrawerTitle>
              </DrawerClose>
            </Link>
            <div className="flex flex-col gap-3 mb-3">
              <DrawerDescription>
                <Link href="/dashboard/chat">
                  <DrawerClose>Chat</DrawerClose>
                </Link>
              </DrawerDescription>
            </div>
            <a
              target="_blank"
              href="https://github.com/soobinrho/caa-supabase"
            >
              <DrawerClose>
                <DrawerTitle>Documentation</DrawerTitle>
              </DrawerClose>
            </a>
          </div>
        </DrawerHeader>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
