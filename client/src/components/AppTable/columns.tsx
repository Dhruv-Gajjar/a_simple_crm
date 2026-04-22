"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

export type Clients = {
  id: string;
  name: string;
  email: string;
  soruce: string;
  status: "active" | "in_active" | "lead" | "rejected";
  phone_number: string;
  remarks: string;
  projects: unknown[];
};

export const columns: ColumnDef<Clients>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "soruce",
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
];
