"use client";

import { FC } from "react";
import { FormDialog } from "./FormDialog";
import { useGlobalStore } from "@/stores/globalStore";
import { useTransactionStore } from "@/stores/transactionStore";
import TransactionForm from "./TransactionForm";

const TransactionDialog: FC = () => {
  const isOpen = useGlobalStore((state) => state.isTransactionDialogOpen);
  const setOpen = useGlobalStore((state) => state.setOpenTransactionDialog);
  const isEditMode = useGlobalStore((state) => state.isEditMode);
  const setIsEditMode = useGlobalStore((state) => state.setIsEditMode);
  const setSelectedTransactionId = useTransactionStore(
    (state) => state.setSelectedTransactionId,
  );

  const handleClose = () => {
    if (isEditMode) {
      setIsEditMode();
    }
    setSelectedTransactionId("");
    setOpen();
  };

  return (
    <FormDialog
      formId="form-transaction"
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit transaction form" : "Create transaction form"}
      description={
        isEditMode
          ? "Fill this form to edit the transaction."
          : "Fill this form to create a new transaction."
      }
    >
      <TransactionForm />
    </FormDialog>
  );
};

export default TransactionDialog;
