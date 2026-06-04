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

  const project = projectsData?.projects?.find(
    (p: Project) => p.id === projectId,
  );
  const client = clientsData?.clients?.find(
    (c: Client) => c.id === project?.clientId,
  );
  return <span>{client ? client.name : "-"}</span>;
};

export const transactionsColumns: ColumnDef<Transactions>[] = [
  {
    accessorKey: "payment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const dateVal = row.getValue("payment_date");
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
    accessorKey: "project_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
    cell: ({ row }) => {
      const projectId = row.getValue("project_id") as string;
      return <ClientNameCell projectId={projectId} />;
    },
  },
  {
    accessorKey: "payment_method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
  },
  {
    accessorKey: "amount_paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
