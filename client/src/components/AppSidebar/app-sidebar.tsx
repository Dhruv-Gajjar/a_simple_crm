"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Blocks, Handshake, ListTodo, Settings, Users } from "lucide-react";
import { NavHeader } from "./nav-header";
import { NavMain } from "./nvm-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "test",
    email: "test@email.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Blocks,
      isActive: false,
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: Users,
    },
    {
      title: "Deals",
      url: "/deals",
      icon: Handshake,
      isActive: true,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: ListTodo,
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
