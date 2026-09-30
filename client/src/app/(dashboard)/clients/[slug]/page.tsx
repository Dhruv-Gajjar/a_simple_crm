"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import useClientManager from "@/hooks/use-client-manager";
import { useClientStore } from "@/stores/clientStore";
import { format } from "date-fns";
import { Calendar, Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { use, useEffect } from "react";
import { toast } from "sonner";

export default function ClientDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const setClientID = useClientStore((state) => state.setClientID);
  const { clientData, isClientLoading, isClientError, clientError } =
    useClientManager();

  const clientStatusColors: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    in_active: "bg-blue-500/15 text-blue-700 border-blue-500/20",
    lead: "bg-amber-500/15 text-amber-700 border-amber-500/20",
    rejected: "bg-destructive/15 text-destructive border-destructive/20",
  };

  const projectStatusColors: Record<string, string> = {
    completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    todo: "bg-blue-500/15 text-blue-700 border-blue-500/20",
    on_hold: "bg-purple-500/15 text-purple-700 border-purple-500/20",
    canceled: "bg-destructive/15 text-destructive border-destructive/20",
    in_progress: "bg-orange-400/15 text-orange-800 border-orange/20",
  };

  useEffect(() => {
    setClientID(slug);
  }, [slug, setClientID]);

  if (isClientLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (isClientError) {
    toast.error(clientError?.message);
  }

  return (
    clientData?.result && (
      <div className="space-y-6">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle>
              <p>{clientData?.result.name}</p>
              <Badge
                className={`${
                  clientStatusColors[
                    clientData?.result.status.toLowerCase() ||
                      "bg-secondary text-secondary-foreground"
                  ]
                } font-medium capitalize shadow-none my-2`}
                variant={"outline"}
              >
                {clientData?.result.status}
              </Badge>
              <span className="text-muted-foreground text-sm font-normal px-4">
                Source: {clientData.result.source}
              </span>
            </CardTitle>
            <Separator />
            <CardDescription>
              <div className="flex items-center gap-6">
                <p className="flex items-center gap-2">
                  <Phone size={18} className="text-primary" />{" "}
                  <span>{clientData.result.phoneNumber}</span>
                </p>
                <Separator orientation="vertical" />
                <p className="flex items-center gap-2">
                  <Mail size={18} className="text-primary" />{" "}
                  <span>{clientData.result.email}</span>
                </p>
                <Separator orientation="vertical" />
                <Link href="#">
                  <p className="flex items-center gap-2 py-4">
                    <Globe size={16} className="text-primary" />{" "}
                    <span className="text-blue-600">htts://test-site.com</span>
                  </p>
                </Link>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clientData.result.projects?.length ? (
              clientData?.result?.projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="flex items-center gap-2">
                          <Calendar size={18} className="text-primary" />{" "}
                          {format(project.startDate, "MMMM-dd-yyyy")}
                        </p>
                        -
                        <p className="flex items-center gap-2">
                          <Calendar size={18} className="text-primary" />{" "}
                          {format(project.endDate, "MMMM-dd-yyyy")}
                        </p>
                      </div>
                      <Badge
                        className={`${
                          projectStatusColors[
                            project.status.toLowerCase() ||
                              "bg-secondary text-secondary-foreground"
                          ]
                        } font-medium capitalize shadow-none my-2`}
                        variant={"outline"}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <Card className="flex items-center flex-row w-full my-4">
                      <CardHeader className="w-full">
                        <CardTitle>{project.totalAmount}</CardTitle>
                        <CardDescription>Budget</CardDescription>
                      </CardHeader>
                      <Separator orientation={"vertical"} />
                      <CardHeader className="w-full">
                        <CardTitle>{project.iterations}</CardTitle>
                        <CardDescription>Iterations</CardDescription>
                      </CardHeader>
                      <Separator orientation={"vertical"} />
                      <CardHeader className="w-full">
                        <CardTitle>{project.totalAmount}</CardTitle>
                        <CardDescription>Budget</CardDescription>
                      </CardHeader>
                      <Separator orientation={"vertical"} />
                      <CardHeader className="w-full">
                        <CardTitle>
                          {project.transactions?.length ?? 0}
                        </CardTitle>
                        <CardDescription>Transactions</CardDescription>
                      </CardHeader>
                      <Separator orientation={"vertical"} />
                      <CardHeader className="w-full">
                        <CardTitle>{project.notes?.length ?? 0}</CardTitle>
                        <CardDescription>Notes</CardDescription>
                      </CardHeader>
                    </Card>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex items-center w-full">
                <p className="text-xl mx-auto py-6 font-semibold">
                  No project found.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  );
}
