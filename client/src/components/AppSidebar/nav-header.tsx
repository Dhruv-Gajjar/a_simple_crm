import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { AudioWaveform, ChevronsUpDown, Plus } from "lucide-react";
import useWorkspace from "@/hooks/use-workspace";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function NavHeader() {
  const { isMobile } = useSidebar();
  const {
    workspacesData,
    isWorkspacesLoading,
    isWorkspacesError,
    workspacesError,
  } = useWorkspace();

  if (isWorkspacesLoading) {
    return (
      <div className="flex items-center gap-4">
        <Skeleton className="aspect-square size-8 h-8 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    );
  }

  if (isWorkspacesError) {
    return toast.error(workspacesError?.message);
  }

  const activeWorkspaces = workspacesData?.filter(
    (workspace) => workspace.isActive,
  );

  return (
    <SidebarMenu className="text-accent">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <AudioWaveform className="size-4" />
              </div>
              {activeWorkspaces && activeWorkspaces?.length > 0 ? (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeWorkspaces[0].name}
                  </span>
                  {/*<span className="truncate text-xs">{activeTeam.plan}</span>*/}
                </div>
              ): <span className="truncate font-small">
                No workspace.
              </span>}
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {activeWorkspaces &&
              activeWorkspaces.map((workspace) => (
                <DropdownMenuItem key={workspace.id} className="gap-2 p-2">
                  {workspace.name}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
