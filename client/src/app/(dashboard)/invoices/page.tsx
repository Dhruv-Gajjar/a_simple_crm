"use client";
import { invoicesColumns } from "@/components/AppTable/columns/invoices-columns";
import { AppDataTable } from "@/components/AppTable/data-table";
import InvoiceDialog from "@/components/InvoiceDialog";
import { useGlobalStore } from "@/stores/globalStore";
import { useRouter } from "next/navigation";
import { FC } from "react";

const Invoices: FC = () => {
  const setOpen = useGlobalStore((state) => state.setOpenInvoiceDialog);
  const router = useRouter();

  const handleClick = () => {
    router.push("/invoices/create");
  };

  return (
    <div className="w-full h-full">
      <AppDataTable
        columns={invoicesColumns}
        data={[]}
        addButtonText="Add Invoices"
        isPagination={true}
        onAddClick={handleClick}
      />
    </div>
  );
};

export default Invoices;
