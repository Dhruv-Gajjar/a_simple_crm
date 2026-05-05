"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useGlobalStore } from "@/stores/globalStore";
import { FC } from "react";
import { useClientStore } from "@/stores/clientStore";
import { Client } from "@/types";

type ActionCellProps = {
  row: Row<Client>;
};

const ActionCell: FC<ActionCellProps> = ({ row }) => {
  const client = row.original;

  const setOpenDeleteDialog = useGlobalStore(
    (state) => state.setOpenDeleteDialog,
  );
  const setOpenClientDialog = useGlobalStore(
    (state) => state.setOpenClientDialog,
  );
  const setEditMode = useGlobalStore((state) => state.setIsEditMode);

  const setClientName = useClientStore((state) => state.setClientName);
  const setClientID = useClientStore((state) => state.setClientID);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setEditMode();
              setClientID(client.ID);
              setOpenClientDialog();
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setClientID(client.ID);
              setClientName(client.name);
              setOpenDeleteDialog();
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");

      const statusColors: Record<string, string> = {
        active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
        in_active: "bg-blue-500/15 text-blue-700 border-blue-500/20",
        lead: "bg-amber-500/15 text-amber-700 border-amber-500/20",
        rejected: "bg-destructive/15 text-destructive border-destructive/20",
      };

      const colorClass =
        statusColors[status.toLowerCase()] ||
        "bg-secondary text-secondary-foreground";

      return (
        <Badge className={`${colorClass} font-medium capitalize shadow-none`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionCell row={row} />;
    },
  },
];
