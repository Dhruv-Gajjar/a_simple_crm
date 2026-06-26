"use client";

import { transactionsColumns } from "@/components/AppTable/columns/transactions-columns";
import { AppDataTable } from "@/components/AppTable/data-table";
import TransactionDialog from "@/components/TransactionDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Spinner } from "@/components/ui/spinner";
import useTransaction from "@/hooks/use-transactions";
import { useGlobalStore } from "@/stores/globalStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { FC } from "react";
import { toast } from "sonner";

const Transactions: FC = () => {
  const {
    transactionsData,
    isTransactionsLoading,
    isTransactionsError,
    transactionsError,
  } = useTransaction();

  const setOpen = useGlobalStore((state) => state.setOpenTransactionDialog);
  const transactionName = useTransactionStore((state) => state.transactionName);

  if (isTransactionsLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  if (isTransactionsError) {
    return toast.error(`Error: ${transactionsError?.message}`, {
      duration: 4000,
    });
  }

  return (
    <div className="w-full h-full">
      <TransactionDialog />
      <DeleteDialog name={transactionName} />
      <AppDataTable
        columns={transactionsColumns}
        data={transactionsData?.result ?? []}
        isPagination={true}
        showAddButton={true}
        addButtonText="Add Transaction"
        onAddClick={setOpen}
      />
    </div>
  );
};

export default Transactions;
