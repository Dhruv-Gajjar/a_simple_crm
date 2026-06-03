import { type Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useGlobalStore } from "@/stores/globalStore";
import { useClientStore } from "@/stores/clientStore";
import { useProjectStore } from "@/stores/projectStore";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const item = row.original as any;

  // Global actions/dialog controls
  const setIsEditMode = useGlobalStore((state) => state.setIsEditMode);
  const setOpenClientDialog = useGlobalStore((state) => state.setOpenClientDialog);
  const setOpenProjectDialog = useGlobalStore((state) => state.setOpenProjectDialog);
  const setOpenDeleteDialog = useGlobalStore((state) => state.setOpenDeleteDialog);

  // Client store actions
  const setClientID = useClientStore((state) => state.setClientID);
  const setClientName = useClientStore((state) => state.setClientName);

  // Project store actions
  const setSelectedProjectId = useProjectStore((state) => state.setSelectedProjectId);
  const setProjectName = useProjectStore((state) => state.setProjectName);

  // Check if the item is a client or project
  // Clients have `email` property, Projects do not.
  const isClient = "email" in item;

  const handleEdit = () => {
    setIsEditMode();
    if (isClient) {
      setClientID(item.id || "");
      setOpenClientDialog();
    } else {
      setSelectedProjectId(item.id || "");
      setOpenProjectDialog();
    }
  };

  const handleDelete = () => {
    if (isClient) {
      setClientID(item.id || "");
      setClientName(item.name || "");
    } else {
      setSelectedProjectId(item.id || "");
      setProjectName(item.name || "");
    }
    setOpenDeleteDialog();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
