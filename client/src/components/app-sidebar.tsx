"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Blocks,
  Boxes,
  ChartBarStacked,
  Layers2,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Blocks,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Users,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: Layers2,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: ChartBarStacked,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      {...props}
      className="text-sidebar-foreground border-sidebar-border"
    >
      <SidebarHeader>
        <header className="flex items-center gap-4 p-4 font-mono">
          <Boxes size={28} />
          <h4 className="text-xl font-semibold">Founder Dairy</h4>
        </header>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {data.navMain.map((item) => (
            <SidebarMenu key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-md">
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <footer className="flex items-center gap-4 p-4">
          <Button variant="outline" className="w-full rounded-sm">
            <LogOut data-icon="inline-end" />
            Logout
          </Button>
        </footer>
      </SidebarFooter>
    </Sidebar>
  );
}
