"use client";

import { clientColumns } from "@/components/AppTable/columns/clients-columns";
import { AppDataTable } from "@/components/AppTable/data-table";
import CreateClientDialog from "@/components/CreateClientDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Spinner } from "@/components/ui/spinner";
import useClientManager from "@/hooks/use-client-manager";
import { useClientStore } from "@/stores/clientStore";
import { useGlobalStore } from "@/stores/globalStore";
import { FC, useMemo } from "react";
import { toast } from "sonner";

const Clients: FC = () => {
  const page = useGlobalStore((state) => state.page);
  const setPage = useGlobalStore((state) => state.setPage);

  const clientName = useClientStore((state) => state.clientName);

  const setOepnCreateClient = useGlobalStore(
    (state) => state.setOpenClientDialog,
  );
  const { clientsData, isClientsLoading, isClientsError, clientsError } =
    useClientManager();

  const handleNextPage = async () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const pageCount = useMemo(() => {
    if (clientsData?.total_clients === undefined) return -1;
    return Math.ceil(clientsData.total_clients / 10);
  }, [clientsData?.total_clients]);

  const isEndOfData = clientsData?.clients
    ? clientsData.clients.length < 10
    : false;

  if (isClientsLoading) {
    return (
      <div className="w-full h-screen">
        <Spinner />
      </div>
    );
  }

  if (isClientsError) {
    toast.error(clientsError?.message, {
      duration: 5000,
    });

    return (
      <div className="w-full h-screen">
        <p className="text-2xl font-semibold">Error</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <CreateClientDialog />
      <DeleteDialog name={clientName} />
      <AppDataTable
        columns={clientColumns}
        data={clientsData?.result}
        isPagination={true}
        nextPage={handleNextPage}
        previousPage={handlePreviousPage}
        currentPage={page}
        pageCount={pageCount}
        isEndOfData={isEndOfData}
        canShowOptions={true}
        showAddButton={true}
        onAddClick={setOepnCreateClient}
        addButtonText="Add Client"
      />
    </div>
  );
};

export default Clients;
