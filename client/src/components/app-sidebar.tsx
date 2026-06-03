"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Blocks,
  Boxes,
  ChartBarStacked,
  ChevronRight,
  CreditCard,
  Folder,
  Layers2,
  LogOut,
  ReceiptText,
  Settings,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Blocks,
      isActive: false,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: Users,
    },
    {
      title: "Projects",
      url: "#",
      icon: Folder,
      isActive: true,
      children: [
        {
          title: "All Projects",
          url: "/projects",
          icon: Layers2,
        },
        {
          title: "Transactions",
          url: "/transactions",
          icon: CreditCard,
        },
        {
          title: "Invoices",
          url: "/invoices",
          icon: ReceiptText,
        },
      ],
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
    <Sidebar {...props} className="text-white border-sidebar-border">
      <SidebarHeader>
        <header className="flex items-center gap-4 p-4 font-mono">
          <Boxes size={28} />
          <h4 className="text-xl font-semibold">Founder Dairy</h4>
        </header>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <Link href={item.url}>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.children && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </Link>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.children && (
                      <SidebarMenuSub>
                        {item.children?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="group/item text-white! hover:text-black! transition-colors"
                            >
                              <Link href={subItem.url}>
                                {subItem.icon && (
                                  <subItem.icon className="w-4 h-4 stroke-white group-hover/item:stroke-black transition-colors" />
                                )}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        {/*<SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem key={item.title}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      <Link
                        href={item.url}
                        className="w-full flex items-center justify-between"
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.children && (
                          <ChevronRight className="justify-end ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              {subItem.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>*/}
      </SidebarContent>
      <SidebarFooter>
        <footer className="flex items-center gap-4 p-4">
          <Button variant="outline" className="w-full">
            <LogOut data-icon="inline-end" />
            Logout
          </Button>
        </footer>
      </SidebarFooter>
    </Sidebar>
  );
}
