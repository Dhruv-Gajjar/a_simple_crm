"use client";

import { clientColumns } from "@/components/AppTable/columns/clients-columns";
import { AppDataTable } from "@/components/AppTable/data-table";
import CreateClientDialog from "@/components/CreateClientDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useClientManager from "@/hooks/use-client-manager";
import { useClientStore } from "@/stores/clientStore";
import { useGlobalStore } from "@/stores/globalStore";
import { ChevronRight, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { toast } from "sonner";

const Clients: FC = () => {
  const page = useGlobalStore((state) => state.page);
  const setPage = useGlobalStore((state) => state.setPage);
  const setOpenClientDialog = useGlobalStore(
    (state) => state.setOpenClientDialog,
  );
  const setEditMode = useGlobalStore((state) => state.setIsEditMode);

  const clientName = useClientStore((state) => state.clientName);
  const setClientID = useClientStore((state) => state.setClientID);

  const setOepnCreateClient = useGlobalStore(
    (state) => state.setOpenClientDialog,
  );
  const { clientsData, isClientsLoading, isClientsError, clientsError } =
    useClientManager();

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    in_active: "bg-blue-500/15 text-blue-700 border-blue-500/20",
    lead: "bg-amber-500/15 text-amber-700 border-amber-500/20",
    rejected: "bg-destructive/15 text-destructive border-destructive/20",
  };

  const colorClass =
    statusColors[status.toLowerCase()] ||
    "bg-secondary text-secondary-foreground";

  const handleNextPage = async () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

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
      <Tabs defaultValue="card" className="w-full">
        <TabsList>
          <TabsTrigger value="card">Card</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
        <TabsContent value="card">
          <div className="pt-4 grid grid-cols-4 gap-6">
            {clientsData?.result.map((client) => (
              <Card
                className="min-w-75 shadow-lg cursor-pointer"
                key={client.id}
                onClick={() => {
                  setClientID(client.id);
                  setEditMode();
                  setOpenClientDialog();
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={client.name} alt={client.name} />
                      <AvatarFallback className="rounded-lg uppercase">
                        {client.name.split(" ")[0][0]}
                        {client.name.split(" ")[1][0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xl font-semibold">{client.name}</span>
                  </CardTitle>
                </CardHeader>
                <Separator className="mx-auto max-w-[80%]" />
                <CardContent className="w-full">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`${
                        statusColors[
                          client.status.toLowerCase() ||
                            "bg-secondary text-secondary-foreground"
                        ]
                      } font-medium capitalize shadow-none`}
                      variant={"outline"}
                    >
                      {client.status}
                    </Badge>
                    <p className="text-gray-500">
                      Total Projects: {client.projects?.length}
                    </p>
                  </div>
                  <div className="space-y-4 py-4">
                    <p className="flex items-center gap-2">
                      <Mail size={14} className="text-blue-600" />
                      <span>{client.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={14} className="text-blue-600" />
                      <span>{client.phoneNumber}</span>
                    </p>
                  </div>
                  <Link
                    href={`/clients/${client.id}`}
                    key={client.id}
                    onClick={() => {
                      setClientID("");
                      setEditMode();
                      setOpenClientDialog();
                    }}
                  >
                    <Button variant={"ghost"}>
                      View More <ChevronRight />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table" className="pt-4">
          <AppDataTable
            columns={clientColumns}
            data={clientsData?.result ?? []}
            isPagination={true}
            nextPage={handleNextPage}
            previousPage={handlePreviousPage}
            currentPage={page}
            // canShowOptions={true}
            // showAddButton={true}
            onAddClick={setOepnCreateClient}
            addButtonText="Add Client"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Clients;
