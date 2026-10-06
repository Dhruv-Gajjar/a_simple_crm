"use client";
import CreateClientDialog from "@/components/CreateClientDialog";
import { AppBarChart } from "@/components/AppBarChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useClientManager from "@/hooks/use-client-manager";
import { useClientStore } from "@/stores/clientStore";
import { useGlobalStore } from "@/stores/globalStore";
import { BriefcaseBusiness, Plus, PlusCircle } from "lucide-react";
import { FC } from "react";
import { toast } from "sonner";
import { AppPieChart } from "@/components/AppPieChart";
import useProject from "@/hooks/use-project";
import { ActiveProjectsWidget } from "@/components/ActiveProjectsWidget";
import { ActiveTasksWidget } from "@/components/ActiveTasksWidget";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import useWorkspace from "@/hooks/use-workspace";
import Link from "next/link";

const Dashboard: FC = () => {
  const { clientsData, isClientsLoading, isClientsError, clientsError } =
    useClientManager();
  const { projectsData } = useProject();
  const { workspacesData, isWorkspacesLoading } = useWorkspace();

  const setOepnCreateClient = useGlobalStore(
    (state) => state.setOpenClientDialog,
  );

  const {
    data: dashboardAnalyticsData,
    isLoading: isDashboardAnalyticsLoading,
    isError: isDashboardAnalyticsError,
    error: dashboardAnalyticsError,
  } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: async () => {
      const data = await DashboardService.getDashboardMetrics();

      return data;
    },
  });

  const clientName = useClientStore((state) => state.clientName);

  if (isClientsError) {
    return toast.error(clientsError?.message ?? "Failed to load clients.!");
  }

  if (isDashboardAnalyticsError) {
    return toast.error(dashboardAnalyticsError.message);
  }

  if (isClientsLoading || isDashboardAnalyticsLoading || isWorkspacesLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      {workspacesData && workspacesData?.length > 0 ? (
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
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Card size="sm" className="mx-auto w-full max-w-sm">
                    <CardContent>
                      <h4 className="text-foreground">Active Clients</h4>
                      <p className="text-3xl font-bold pt-2">
                        {dashboardAnalyticsData?.result.totalActiveClients}
                      </p>
                      <p className="text-orange-400 font-semibold">
                        +2 leads pending
                      </p>
                    </CardContent>
                  </Card>
                  <Card size="sm" className="mx-auto w-full max-w-sm">
                    <CardContent>
                      <h4 className="text-foreground">Active Projects</h4>
                      <p className="text-3xl font-bold pt-2">
                        {dashboardAnalyticsData?.result.totalActiveProjects}
                      </p>
                      <p className="text-green-400 font-semibold">
                        +2 projects completed
                      </p>
                    </CardContent>
                  </Card>
                  <Card size="sm" className="mx-auto w-full max-w-sm">
                    <CardContent>
                      <h4 className="text-foreground">Total Earnings</h4>
                      <p className="text-3xl font-bold pt-2">
                        $ {dashboardAnalyticsData?.result.totalEarnings}
                      </p>
                      <p className="text-green-400 font-semibold">
                        +12 % this month
                      </p>
                    </CardContent>
                  </Card>
                  <Card size="sm" className="mx-auto w-full max-w-sm">
                    <CardContent>
                      <h4 className="text-foreground">Pending Invoices</h4>
                      <p className="text-3xl font-bold pt-2">$ {10000}</p>
                      <p className="text-orange-400 font-semibold">
                        2 invoices pending
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-12 gap-6 pt-4">
                  <ActiveProjectsWidget
                    activeProjects={
                      dashboardAnalyticsData?.result.activeProjects ?? []
                    }
                  />
                  <ActiveTasksWidget />
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
      ) : (
        <EmptyWorkspaceView />
      )}
    </div>
  );
};

export default Dashboard;

function EmptyWorkspaceView() {
  return (
    <div className="container mx-auto min-w-lg h-150 col-span-8">
      <Card className="h-full">
        <CardContent className="py-4 h-full">
          <div className="flex flex-col justify-center items-center space-y-4 h-full">
            <div className="flex items-center gap-4">
              <BriefcaseBusiness size={24} />
              <h2 className="text-xl font-semibold tracking-tight">
                No worksapce found.
              </h2>
            </div>
            <p className="text-muted-foreground">
              You can add a new workspace by clicking on the button below.
            </p>
            <Link href={"/workspace"}>
            <Button>
              <Plus />
              Create new workspace
            </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
