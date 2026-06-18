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

const Projects: FC = () => {
  const { projectsData, isProjectsLoading, isProjectsError, projectsError } =
    useProject();

  const setOpen = useGlobalStore((state) => state.setOpenProjectDialog);
  const projectName = useProjectStore((state) => state.projectName);

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
      {projectsData && (
        <AppDataTable
          columns={projectsColumns}
          data={projectsData.result ? projectsData.result?.projects : []}
          isPagination={true}
          addButtonText="Add Project"
          onAddClick={setOpen}
        />
      )}
    </div>
  );
};

export default Projects;
