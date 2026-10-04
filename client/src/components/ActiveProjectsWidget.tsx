import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "./ui/progress";
import { Project } from "@/types";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Folders, Plus } from "lucide-react";

export function ActiveProjectsWidget({
  activeProjects,
}: {
  activeProjects: Project[];
}) {
  return activeProjects.length <= 0 ? (
    <EmptyStateProject />
  ) : (
    <Card className="w-full col-span-8">
      <CardHeader>
        <CardTitle className="text-xl">Active Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-hidden">
        {activeProjects?.map((project) => (
          <Card key={project.id}>
            <CardContent>
              <p className="font-semibold">
                {project.name} - (Client: {project?.client?.name})
              </p>
              <div className="flex items-center gap-6">
                <Progress value={60} className="w-[80%] max-w-lg" />
                <span className="text-gray-500">
                  Due Date: {format(project.endDate, "MMM-dd")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function EmptyStateProject() {
  return (
    <div className="container mx-auto min-w-lg col-span-8">
      <Card className="h-100">
        <CardContent className="py-4 h-full">
          <div className="flex flex-col justify-center items-center space-y-4 h-full">
            <div className="flex items-center gap-4">
              <Folders size={24} />
              <h2 className="text-xl font-semibold tracking-tight">
                No projects found.
              </h2>
            </div>
            <p className="text-muted-foreground">
              You can add a new project by clicking on the button below.
            </p>
            <Button>
              <Plus />
              New Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
