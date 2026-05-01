"use client";
import axiosInstance from "@/api";
import { columns } from "@/components/AppTable/columns";
import { AppDataTable } from "@/components/AppTable/data-table";
import CreateClientDialog from "@/components/CreateClientDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useClientManager from "@/hooks/use-client-manager";
import { useClientStore } from "@/stores/clientStore";
import { Transactions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { FC } from "react";
import { toast } from "sonner";

const Dashboard: FC = () => {
  let totalEarnings: number = 0;
  const { clients, isClientsLoading, isClientsError, clientsError } =
    useClientManager();

  const setOepnCreateClient = useClientStore(
    (state) => state.setOpenCreateClient,
  );

  const {
    data: projects,
    isError: isProjectsError,
    error: projectsError,
    isLoading: isProjectsLoading,
  } = useQuery({
    queryKey: ["getAllProjects"],
    queryFn: async () => {
      const response = await axiosInstance.get("project/");
      return response.data;
    },
  });

  const {
    data: transactions,
    isError: isTransactionsError,
    error: transactionsError,
    isLoading: isTransactionLoading,
  } = useQuery({
    queryKey: ["getAllTransactions"],
    queryFn: async () => {
      const response = await axiosInstance.get("transaction/");
      return response.data;
    },
  });

  if (isClientsError || isProjectsError || isTransactionsError) {
    return (
      <div className="text-red-400 w-full h-screen">
        Error while loading data:{" "}
        {isClientsError && clientsError instanceof Error
          ? toast.error(clientsError?.message, { duration: 5000 })
          : "Unknown Error"}
        {isProjectsError && projectsError instanceof Error
          ? toast.error(projectsError?.message, { duration: 5000 })
          : "Unknown Error"}
        {isTransactionsError && transactionsError instanceof Error
          ? toast.error(transactionsError?.message, { duration: 5000 })
          : "Unknown Error"}
      </div>
    );
  }

  if (transactions) {
    const totalCost = transactions?.data?.reduce(
      (acc: number, val: Transactions) => {
        return acc + val.amount_paid;
      },
      0,
    );
    totalEarnings = totalCost;
  }

  if (isClientsLoading || isProjectsLoading || isTransactionLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex items-center justify-between pb-4">
        <CreateClientDialog />
        <Tabs defaultValue="overview" className="w-full">
          <div className="w-full flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <Button onClick={() => setOepnCreateClient()}>
              <PlusCircle />
              New Client
            </Button>
          </div>
          <TabsContent value="overview">
            <>
              <div className="grid grid-cols-3 gap-4 items-center">
                <Card size="sm" className="mx-auto w-full max-w-sm">
                  <CardContent>
                    <h4 className="text-foreground">Total Clients</h4>
                    <p className="text-3xl font-bold pt-2">
                      {clients.active_clients} / {clients.total_clients}
                    </p>
                  </CardContent>
                </Card>
                <Card size="sm" className="mx-auto w-full max-w-sm">
                  <CardContent>
                    <h4 className="text-foreground">Total Projects</h4>
                    <p className="text-3xl font-bold pt-2">
                      {projects.data.Active} / {projects.data.Total}
                    </p>
                  </CardContent>
                </Card>
                <Card size="sm" className="mx-auto w-full max-w-sm">
                  <CardContent>
                    <h4 className="text-foreground">Total Earnings</h4>
                    <p className="text-3xl font-bold pt-2">$ {totalEarnings}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4">
                {clients && (
                  <AppDataTable columns={columns} data={clients.clients} />
                )}
              </div>
            </>
          </TabsContent>
          <TabsContent value="analytics">
            <div>
              <p>Analytics</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
