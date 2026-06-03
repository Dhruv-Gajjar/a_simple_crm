import { Project, Client } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "../ui/badge";
import { DataTableRowActions } from "./data-table-actions";
import { format } from "date-fns";
import useClientManager from "@/hooks/use-client-manager";

const ClientNameCell = ({ clientId }: { clientId: string }) => {
  const { clientsData } = useClientManager();
  const client = clientsData?.clients?.find((c: Client) => c.id === clientId);
  return <span>{client ? client.name : clientId}</span>;
};

export const projectsColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
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
        completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
        todo: "bg-blue-500/15 text-blue-700 border-blue-500/20",
        on_hold: "bg-purple-500/15 text-purple-700 border-purple-500/20",
        canceled: "bg-destructive/15 text-destructive border-destructive/20",
        in_progress: "bg-orange-400/15 text-orange-800 border-orange/20",
      };

      const colorClass =
        statusColors[status.toLowerCase()] ||
        "bg-secondary text-secondary-foreground";

      return (
        <Badge className={`${colorClass} font-medium capitalize shadow-none `}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "clientId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
    cell: ({ row }) => {
      const clientId = row.getValue("clientId") as string;
      return <ClientNameCell clientId={clientId} />;
    },
  },
  {
    accessorKey: "total_cost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Cost" />
    ),
    cell: ({ row }) => {
      const totalCost: number = row.getValue("total_cost");

      return <p>{totalCost}</p>;
    },
  },
  {
    accessorKey: "iterations",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Iterations" />
    ),
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const dateVal = row.getValue("start_date");
      if (!dateVal) return "-";
      try {
        return <span>{format(new Date(dateVal as string | number | Date), "PP")}</span>;
      } catch (e) {
        return <span>{String(dateVal)}</span>;
      }
    },
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const dateVal = row.getValue("end_date");
      if (!dateVal) return "-";
      try {
        return <span>{format(new Date(dateVal as string | number | Date), "PP")}</span>;
      } catch (e) {
        return <span>{String(dateVal)}</span>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
