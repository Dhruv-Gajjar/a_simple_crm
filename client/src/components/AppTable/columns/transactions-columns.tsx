import { Client, Project, Transactions } from "@/types";
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

  const project = projectsData?.result.find(
    (p: Project) => p.id === projectId,
  ) as Project;
  const client = clientsData?.result.find(
    (c: Client) => c.id === project?.clientId,
  );

  return <span>{client ? client.name : "-"}</span>;
};

const ProjectNameCell = ({ projectId }: { projectId: string }) => {
  const { projectsData } = useProject();

  const project = projectsData?.result.find(
    (p: Project) => p.id === projectId,
  ) as Project;

  return <span>{project ? project.name : "-"}</span>;
};

export const transactionsColumns: ColumnDef<Transactions>[] = [
  {
    accessorKey: "paymentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const dateVal = row.getValue("paymentDate");
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
    accessorKey: "projectId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
    cell: ({ row }) => {
      const projectId = row.getValue("projectId") as string;
      return <ClientNameCell projectId={projectId} />;
    },
  },
  {
    id: "projectName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Name" />
    ),
    cell: ({ row }) => {
      const projectId = row.getValue("projectId") as string;
      return <ProjectNameCell projectId={projectId} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status: string = row.getValue("status");

      const statusColors: Record<string, string> = {
        paid: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
        failed: "bg-destructive/15 text-destructive border-destructive/20",
        pending: "bg-orange-400/15 text-orange-800 border-orange/20",
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
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
