"use client";

import { FC } from "react";
import { FormDialog } from "./FormDialog";
import { useGlobalStore } from "@/stores/globalStore";
import InvoiceForm from "./InvoiceForm";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { redirect } from "next/navigation";

const InvoiceDialog: FC = () => {
  const isOpen = useGlobalStore((state) => state.isInvoiceDialogOpen);
  const setOpen = useGlobalStore((state) => state.setOpenInvoiceDialog);
  const isEditMode = useGlobalStore((state) => state.isEditMode);
  const setIsEditMode = useGlobalStore((state) => state.setIsEditMode);
  const setSelectedInvoiceId = useInvoiceStore(
    (state) => state.setSelectedInvoiceId,
  );

  const handleClose = () => {
    if (isEditMode) {
      setIsEditMode();
    }
    setSelectedInvoiceId("");
    redirect("/invoice/create");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => () => !open && handleClose()}>
      <DialogContent className="sm:max-w-225 w-[98vw] h-[85vh] flex flex-col">
        <DialogHeader>Invoices</DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
