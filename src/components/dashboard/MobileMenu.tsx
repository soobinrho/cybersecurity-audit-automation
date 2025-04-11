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
import Footer from "@/components/dashboard/Footer";

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
            <Link href="/dashboard/supabase">
              <DrawerClose>
                <DrawerTitle>Supabase</DrawerTitle>
              </DrawerClose>
            </Link>
            <div className="flex flex-col gap-3 mb-3">
              <DrawerDescription>
                <Link href="/dashboard/supabase/getting-started">
                  <DrawerClose>Getting Started</DrawerClose>
                </Link>
              </DrawerDescription>
              <DrawerDescription>
                <Link href="/dashboard/supabase/mfa">
                  <DrawerClose>MFA</DrawerClose>
                </Link>
              </DrawerDescription>
              <DrawerDescription>
                <Link href="/dashboard/supabase/pitr">
                  <DrawerClose>PITR</DrawerClose>
                </Link>
              </DrawerDescription>
              <DrawerDescription>
                <Link href="/dashboard/supabase/rls">
                  <DrawerClose>RLS</DrawerClose>
                </Link>
              </DrawerDescription>
              <DrawerDescription>
                <Link href="/dashboard/supabase/evidence-images">
                  <DrawerClose>Evidence Images</DrawerClose>
                </Link>
              </DrawerDescription>
              <DrawerDescription>
                <Link href="/dashboard/supabase/audit-logs">
                  <DrawerClose>Audit Logs</DrawerClose>
                </Link>
              </DrawerDescription>
            </div>

            <Link href="/dashboard/aws">
              <DrawerClose>
                <DrawerTitle>AWS</DrawerTitle>
              </DrawerClose>
            </Link>
            <div className="flex flex-col gap-3 mb-3">
              <DrawerDescription>
                <Link href="/dashboard/aws/getting-started">
                  <DrawerClose>Getting Started</DrawerClose>
                </Link>
              </DrawerDescription>
            </div>

            <Link href="/dashboard/gcp">
              <DrawerClose>
                <DrawerTitle>GCP</DrawerTitle>
              </DrawerClose>
            </Link>
            <div className="flex flex-col gap-3 mb-3">
              <DrawerDescription>
                <Link href="/dashboard/gcp/getting-started">
                  <DrawerClose>Getting Started</DrawerClose>
                </Link>
              </DrawerDescription>
            </div>

            <Link href="/dashboard/azure">
              <DrawerClose>
                <DrawerTitle>Azure</DrawerTitle>
              </DrawerClose>
            </Link>
            <div className="flex flex-col gap-3 mb-3">
              <DrawerDescription>
                <Link href="/dashboard/azure/getting-started">
                  <DrawerClose>Getting Started</DrawerClose>
                </Link>
              </DrawerDescription>
            </div>

            <Link href="/dashboard/hetzner">
              <DrawerClose>
                <DrawerTitle>Hetzner</DrawerTitle>
              </DrawerClose>
            </Link>
            <div className="flex flex-col gap-3 mb-3">
              <DrawerDescription>
                <Link href="/dashboard/hetzner/getting-started">
                  <DrawerClose>Getting Started</DrawerClose>
                </Link>
              </DrawerDescription>
            </div>

            <Link href="/dashboard/vercel">
              <DrawerClose>
                <DrawerTitle>Vercel</DrawerTitle>
              </DrawerClose>
            </Link>
            <div className="flex flex-col gap-3 mb-3">
              <DrawerDescription>
                <Link href="/dashboard/vercel/getting-started">
                  <DrawerClose>Getting Started</DrawerClose>
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
              href="https://github.com/soobinrho/cybersecurity-audit-automation"
            >
              <DrawerClose>
                <DrawerTitle>Documentation</DrawerTitle>
              </DrawerClose>
            </a>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <Footer />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
