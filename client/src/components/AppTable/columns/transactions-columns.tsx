import { Client, Project, Transactions } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { format } from "date-fns";
import useClientManager from "@/hooks/use-client-manager";
import useProject from "@/hooks/use-project";
import { DataTableRowActions } from "../data-table-actions";

const ClientNameCell = ({ projectId }: { projectId: string }) => {
  const { projectsData } = useProject();
  const { clientsData } = useClientManager();

  const project = projectsData?.result.projects.find(
    (p: Project) => p.id === projectId,
  ) as Project;
  const client = clientsData?.result.clients.find(
    (c: Client) => c.id === project?.clientId,
  );

  return <span>{client ? client.name : "-"}</span>;
};

const ProjectNameCell = ({ projectId }: { projectId: string }) => {
  const { projectsData } = useProject();

  const project = projectsData?.result.projects.find(
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
