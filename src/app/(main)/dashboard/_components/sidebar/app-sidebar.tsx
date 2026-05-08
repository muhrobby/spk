"use client";

import Link from "next/link";

import { Command } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarDateClock } from "./sidebar-date-clock";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: {
    readonly name: string;
    readonly email: string;
    readonly image?: string | null;
  };
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full overflow-hidden">
              <Link
                prefetch={false}
                href="/dashboard"
                className="flex w-full items-center gap-2 overflow-hidden"
              >
                <Command className="size-4 shrink-0" />
                <Marquee
                  autoFill
                  gradient={false}
                  pauseOnHover
                  speed={28}
                  className="min-w-0 flex-1"
                >
                  <span className="pr-6 font-medium">{APP_CONFIG.name}</span>
                </Marquee>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
        <SidebarDateClock />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
