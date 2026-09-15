import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "./ui/progress";
import { Project } from "@/types";
import { format } from "date-fns";

export function ActiveProjectsWidget({
  activeProjects,
}: {
  activeProjects: Project[];
}) {
  return (
    <Card className="w-full col-span-8">
      <CardHeader>
        <CardTitle className="text-xl">Active Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-hidden">
        {activeProjects?.map((project) => (
          <Card key={project.id}>
            <CardContent>
              <p className="font-semibold">
                {project.name} - (Client: {project.client.name})
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
