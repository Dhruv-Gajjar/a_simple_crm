import { Client, Invoices, Project } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { format } from "date-fns";
import useClientManager from "@/hooks/use-client-manager";
import useProject from "@/hooks/use-project";
import { DataTableRowActions } from "../data-table-actions";
import { Badge } from "@/components/ui/badge";

const ClientNameCell = ({ projectId }: { projectId: string }) => {
  const { projectsData } = useProject();
  const { clientsData } = useClientManager();

  if (!projectId) return;

  const project = projectsData?.projects?.find(
    (p: Project) => p.id === projectId,
  );
  const client = clientsData?.clients?.find(
    (c: Client) => c.id === project?.clientId,
  );
  return <span>{client ? client.name : "-"}</span>;
};

export const invoicesColumns: ColumnDef<Invoices>[] = [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice Number" />
    ),
  },
  {
    accessorKey: "projectId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
    cell: ({ row }) => {
      const projectId = row.getValue("project_id") as string;
      return <ClientNameCell projectId={projectId} />;
    },
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const dateVal = row.getValue("issueDate");
      if (!dateVal) return "-";
      try {
        return (
          <span>
            {format(new Date(dateVal as string | number | Date), "PP")}
          </span>
        );
      } catch (e) {
        return <span>{String(dateVal)}</span>;
      }
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const dateVal = row.getValue("dueDate");
      if (!dateVal) return "-";
      try {
        return (
          <span>
            {format(new Date(dateVal as string | number | Date), "PP")}
          </span>
        );
      } catch (e) {
        return <span>{String(dateVal)}</span>;
      }
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
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
        draft: "bg-gray-500/15 text-gray-700 border-gray-500/20",
        paid: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
        sent: "bg-amber-500/15 text-amber-700 border-amber-500/20",
        overdue: "bg-destructive/15 text-destructive border-destructive/20",
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
