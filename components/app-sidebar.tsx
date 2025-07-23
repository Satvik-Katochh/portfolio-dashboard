"use client";

import * as React from "react";
import {
  IconChartBar,
  IconTrendingUp,
  IconReport,
  IconDatabase,
  IconWallet,
  IconCurrencyRupee,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconFileText,
  IconBriefcase,
  IconReceipt2,
  IconFileChart,
  IconFileDollar,
  IconFileSpreadsheet,
  IconFileAnalytics,
  IconFileInvoice,
  IconFileReport,
  IconFileTextAi,
  IconFileDescription,
  IconInnerShadowTop,
  IconBuildingBank,
  IconHistory,
  IconCashBanknote,
  IconReceipt,
  IconFileStack,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Satvik",
    email: "katochsatvik@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Holdings",
      url: "#",
      icon: IconBriefcase,
    },
    {
      title: "Transactions",
      url: "#",
      icon: IconReceipt2,
    },
    {
      title: "Markets",
      url: "#",
      icon: IconTrendingUp,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Reports",
      url: "#",
      icon: IconReport,
    },
  ],
  navClouds: [
    {
      title: "Holdings",
      icon: IconBriefcase,
      url: "#",
      items: [
        { title: "All Holdings", url: "#" },
        { title: "By Sector", url: "#" },
      ],
    },
    {
      title: "Transactions",
      icon: IconReceipt2,
      url: "#",
      items: [
        { title: "All Transactions", url: "#" },
        { title: "Dividends", url: "#" },
      ],
    },
    {
      title: "Statements",
      icon: IconFileChart,
      url: "#",
      items: [
        { title: "Account Statement", url: "#" },
        { title: "Tax Statement", url: "#" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Statements",
      url: "#",
      icon: IconFileSpreadsheet,
    },
    {
      name: "Tax Reports",
      url: "#",
      icon: IconFileInvoice,
    },
    {
      name: "Performance",
      url: "#",
      icon: IconFileAnalytics,
    },
    {
      name: "Holdings Report",
      url: "#",
      icon: IconFileStack,
    },
    {
      name: "Dividends",
      url: "#",
      icon: IconCashBanknote,
    },
    {
      name: "Trade History",
      url: "#",
      icon: IconHistory,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">8byte Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.filter((item) => item.title !== "Dashboard")}
        />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
