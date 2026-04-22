"use client";
import axiosInstance from "@/api";
import { columns } from "@/components/AppTable/columns";
import { AppDataTable } from "@/components/AppTable/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { FC } from "react";

const Dashboard: FC = () => {
  const {
    data: clients,
    isError: isClientsError,
    error: clientsError,
    isLoading: isClientsLoading,
  } = useQuery({
    queryKey: ["getAllClients"],
    queryFn: async () => {
      const response = await axiosInstance.get("client/");
      return response.data;
    },
  });

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

  if (isClientsError || isProjectsError) {
    return (
      <div className="text-red-400 w-full h-screen">
        Error while loading data:{" "}
        {isClientsError && clientsError instanceof Error ? (
          <p className="text-xl">{clientsError.message}</p>
        ) : (
          "Unknown Error"
        )}
        {isProjectsError && projectsError instanceof Error ? (
          <p className="text-xl">{projectsError.message}</p>
        ) : (
          "Unknown Error"
        )}
      </div>
    );
  }

  if (isClientsLoading || isProjectsLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex items-center justify-between pb-4">
        <Tabs defaultValue="overview" className="w-100">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"></TabsContent>
        </Tabs>
        <Button className="rounded-lg">
          <PlusCircle />
          New Client
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4 items-center">
        <Card size="sm" className="mx-auto w-full max-w-sm">
          <CardContent>
            <h4 className="text-foreground">Total Clients</h4>
            <p className="text-3xl font-bold pt-2">
              {clients.data.Active} / {clients.data.Total}
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
            <h4 className="text-foreground">Total Projects</h4>
            <p className="text-3xl font-bold pt-2">
              {projects.data.Active} / {projects.data.Total}
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
      </div>

      <div className="pt-4">
        {clients && (
          <AppDataTable columns={columns} data={clients.data.ActiveClients} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
