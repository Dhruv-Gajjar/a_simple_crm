"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Client } from "@/types";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-actions";

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
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
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Soruce" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
