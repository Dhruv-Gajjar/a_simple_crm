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
import { useTransactionStore } from "@/stores/transactionStore";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const item = row.original as any;

  const setIsEditMode = useGlobalStore((state) => state.setIsEditMode);
  const setOpenClientDialog = useGlobalStore(
    (state) => state.setOpenClientDialog,
  );
  const setOpenProjectDialog = useGlobalStore(
    (state) => state.setOpenProjectDialog,
  );
  const setOpenTransactionDialog = useGlobalStore(
    (state) => state.setOpenTransactionDialog,
  );
  const setOpenDeleteDialog = useGlobalStore(
    (state) => state.setOpenDeleteDialog,
  );

  const setClientID = useClientStore((state) => state.setClientID);
  const setClientName = useClientStore((state) => state.setClientName);

  const setSelectedProjectId = useProjectStore(
    (state) => state.setSelectedProjectId,
  );
  const setProjectName = useProjectStore((state) => state.setProjectName);

  const setSelectedTransactionId = useTransactionStore(
    (state) => state.setSelectedTransactionId,
  );
  const setTransactionName = useTransactionStore(
    (state) => state.setTransactionName,
  );

  const isClient = "email" in item;
  const isTransaction = "paymentMethod" in item || "payment_method" in item;

  const handleEdit = () => {
    setIsEditMode();
    if (isClient) {
      setClientID(item.id || "");
      setOpenClientDialog();
    } else if (isTransaction) {
      setSelectedTransactionId(item.id || "");
      setOpenTransactionDialog();
    } else {
      setSelectedProjectId(item.id || "");
      setOpenProjectDialog();
    }
  };

  const handleDelete = () => {
    if (isClient) {
      setClientID(item.id || "");
      setClientName(item.name || "");
    } else if (isTransaction) {
      setSelectedTransactionId(item.id || "");
      setTransactionName(
        `Transaction: $${item.amount_paid ?? item.amountPaid ?? 0} via ${
          item.payment_method ?? item.paymentMethod ?? ""
        }`,
      );
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
