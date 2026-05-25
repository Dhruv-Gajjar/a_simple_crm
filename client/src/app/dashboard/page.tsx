"use client";
import axiosInstance from "@/api";
import { columns } from "@/components/AppTable/columns";
import { AppDataTable } from "@/components/AppTable/data-table";
import CreateClientDialog from "@/components/CreateClientDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { AppBarChart } from "@/components/AppBarChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useClientManager from "@/hooks/use-client-manager";
import { useClientStore } from "@/stores/clientStore";
import { useGlobalStore } from "@/stores/globalStore";
import { Transactions } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { FC } from "react";
import { toast } from "sonner";
import { AppPieChart } from "@/components/AppPieChart";
import { mockClients } from "@/mockData";

const Dashboard: FC = () => {
  const { clientsData, isClientsLoading, isClientsError, clientsError } =
    useClientManager();

  const setOepnCreateClient = useGlobalStore(
    (state) => state.setOpenClientDialog,
  );

  const clientName = useClientStore((state) => state.clientName);

  if (isClientsError) {
    return (
      <div className="text-red-400 w-full h-screen">
        {isClientsError && clientsError instanceof Error
          ? toast.error(clientsError?.message, { duration: 5000 })
          : "Unknown Error"}
      </div>
    );
  }

  if (isClientsLoading) {
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
                      {clientsData ? clientsData.active_clients : 2} /{" "}
                      {clientsData ? clientsData.total_clients : 4}
                    </p>
                  </CardContent>
                </Card>
                <Card size="sm" className="mx-auto w-full max-w-sm">
                  <CardContent>
                    <h4 className="text-foreground">Total Projects</h4>
                    <p className="text-3xl font-bold pt-2">
                      {1} / {2}
                    </p>
                  </CardContent>
                </Card>
                <Card size="sm" className="mx-auto w-full max-w-sm">
                  <CardContent>
                    <h4 className="text-foreground">Total Earnings</h4>
                    <p className="text-3xl font-bold pt-2">
                      $ {totalEarnings ? totalEarnings : 20000}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-4">
                <DeleteDialog name={clientName} />
                {clientsData.clients && (
                  <AppDataTable
                    columns={columns}
                    data={clientsData.clients}
                    isPagination={false}
                  />
                )}
              </div>
            </>
          </TabsContent>
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 p-4 w-full">
              <AppBarChart />
              <AppPieChart />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
