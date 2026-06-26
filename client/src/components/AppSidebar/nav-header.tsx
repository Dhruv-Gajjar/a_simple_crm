import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { AudioWaveform, ChevronsUpDown } from "lucide-react";

export function NavHeader() {
  return (
    <SidebarMenu className="text-accent">
      <SidebarMenuItem>
        <Link href={"/"}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <AudioWaveform className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Founder diary</span>
              <span className="truncate text-xs">A simple CRM</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
