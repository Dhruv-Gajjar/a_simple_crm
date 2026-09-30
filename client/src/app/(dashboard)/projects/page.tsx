"use client";

import { AppDataTable } from "@/components/AppTable/data-table";
import { projectsColumns } from "@/components/AppTable/columns/projects-columns";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Spinner } from "@/components/ui/spinner";
import useProject from "@/hooks/use-project";
import { useGlobalStore } from "@/stores/globalStore";
import { useProjectStore } from "@/stores/projectStore";
import { FC } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const Projects: FC = () => {
  const { projectsData, isProjectsLoading, isProjectsError, projectsError } =
    useProject();

  const setOpen = useGlobalStore((state) => state.setOpenProjectDialog);
  const setEditMode = useGlobalStore((state) => state.setIsEditMode);

  const projectName = useProjectStore((state) => state.projectName);
  const setProjectID = useProjectStore((state) => state.setSelectedProjectId);

  const statusColors: Record<string, string> = {
    completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20",
    todo: "bg-blue-500/15 text-blue-700 border-blue-500/20",
    on_hold: "bg-purple-500/15 text-purple-700 border-purple-500/20",
    canceled: "bg-destructive/15 text-destructive border-destructive/20",
    in_progress: "bg-orange-400/15 text-orange-800 border-orange/20",
  };

  if (isProjectsLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  if (isProjectsError) {
    return toast.error(`Error: ${projectsError?.message}`, {
      duration: 4000,
    });
  }

  return (
    <div className="w-full h-full">
      <CreateProjectDialog />
      <DeleteDialog name={projectName} />
      <Tabs defaultValue="card" className="w-full">
        <TabsList>
          <TabsTrigger value="card">Card</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
        <TabsContent value="card">
          <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            {projectsData?.result.map((project) => (
              <Card
                className="min-w-75 shadow-lg cursor-pointer"
                key={project.id}
                onClick={() => {
                  setProjectID(project.id);
                  setEditMode();
                  setOpen();
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={project.name} alt={project.name} />
                      <AvatarFallback className="rounded-lg uppercase">
                        {project.name.split(" ")[0][0]}
                        {project.name.split(" ")[1][0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xl font-semibold">
                      {project.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <Separator className="mx-auto max-w-[80%]" />
                <CardContent className="w-full">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`${
                        statusColors[
                          project.status.toLowerCase() ||
                            "bg-secondary text-secondary-foreground"
                        ]
                      } font-medium capitalize shadow-none`}
                      variant={"outline"}
                    >
                      {project.status}
                    </Badge>
                    <p className="text-gray-500">
                      Total transactions: {project?.transactions?.length ?? 0}
                    </p>
                  </div>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-[48px_20px_1fr] items-center gap-2">
                      <span>Start:</span>
                      <Calendar size={14} className="text-blue-600" />
                      <span>{format(project.startDate, "MMMM-dd-yyyy")}</span>
                    </div>

                    <div className="grid grid-cols-[48px_20px_1fr] items-center gap-2">
                      <span>End:</span>
                      <Calendar size={14} className="text-blue-600" />
                      <span>{format(project.endDate, "MMMM-dd-yyyy")}</span>
                    </div>
                  </div>

                  <Link
                    href={`/projects/${project.id}`}
                    onClick={() => {
                      setProjectID("");
                      setEditMode();
                      setOpen();
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
          {projectsData && (
            <AppDataTable
              columns={projectsColumns}
              data={projectsData.result ?? []}
              isPagination={true}
              showAddButton={true}
              addButtonText="Add Project"
              onAddClick={setOpen}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
