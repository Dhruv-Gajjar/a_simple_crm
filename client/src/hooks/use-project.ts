import { ProjectService } from "@/services/projectService";
import { useGlobalStore } from "@/stores/globalStore";
import { NewProject, Project } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ProjectResponse = {
  projects: Project[];
  total: number;
  active: number;
};

const useProject = () => {
  const page = useGlobalStore((state) => state.page);
  const queryClient = useQueryClient();

  const {
    data: projectsData,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
    error: projectsError,
  } = useQuery({
    queryKey: ["projects", page],
    queryFn: async (): Promise<ProjectResponse> => {
      const projects = await ProjectService.getAllProjects(page);
      return projects;
    },
  });

  const createNewProject = useMutation({
    mutationKey: ["create_project"],
    mutationFn: ProjectService.createProject,
    onMutate: async (newProject: NewProject) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previousProjects = queryClient.getQueryData<ProjectResponse>([
        "projects",
      ]);
      if (previousProjects) {
        queryClient.setQueryData<ProjectResponse>(["projects"], {
          ...previousProjects,
          projects: [...previousProjects.projects, newProject as Project],
        });
      }
      return { previousProjects };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const updateProject = useMutation({
    mutationKey: ["update_project"],
    mutationFn: ProjectService.updateProject,
    onMutate: async (updatedProject: Project) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previousProjects = queryClient.getQueryData<ProjectResponse>([
        "projects",
      ]);
      if (previousProjects) {
        queryClient.setQueryData<ProjectResponse>(["projects"], {
          ...previousProjects,
          projects: previousProjects.projects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project,
          ),
        });
      }
      return { previousProjects };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteProject = useMutation({
    mutationKey: ["delete_project"],
    mutationFn: ProjectService.deleteProject,
    onMutate: async (projectId: string) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previousProjects = queryClient.getQueryData<ProjectResponse>([
        "projects",
      ]);
      if (previousProjects) {
        queryClient.setQueryData<ProjectResponse>(["projects"], {
          ...previousProjects,
          projects: previousProjects.projects.filter(
            (project) => project.id !== projectId,
          ),
        });
      }
      return { previousProjects };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projectsData,
    isProjectsLoading,
    isProjectsError,
    projectsError,
    createNewProject,
    updateProject,
    deleteProject,
  };
};

export default useProject;
