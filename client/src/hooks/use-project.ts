import { ProjectService } from "@/services/project.service";
import { useGlobalStore } from "@/stores/globalStore";
import { NewProject, Project, ProjectResponse, ResponsePayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    queryFn: async () => {
      const projects = await ProjectService.getAllProjects(page);
      return projects;
    },
  });

  const createNewProject = useMutation({
    mutationKey: ["create_project"],
    mutationFn: ProjectService.createProject,
    onMutate: async (newProject: NewProject) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previousProjects = queryClient.getQueryData<
        ResponsePayload<ProjectResponse>
      >(["projects"]);
      if (previousProjects) {
        queryClient.setQueryData(["projects"], {
          ...previousProjects,
          result: {
            projects: [
              ...previousProjects.result.projects,
              newProject as Project,
            ],
          },
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
      const previousProjects = queryClient.getQueryData<
        ResponsePayload<ProjectResponse>
      >(["projects"]);
      if (previousProjects) {
        queryClient.setQueryData<ResponsePayload<ProjectResponse>>(
          ["projects"],
          {
            ...previousProjects,
            result: {
              projects: previousProjects.result.projects.map((project) =>
                project.id === updatedProject.id ? updatedProject : project,
              ),
              total: previousProjects.result.total,
              active: previousProjects.result.active,
            },
          },
        );
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
      const previousProjects = queryClient.getQueryData<
        ResponsePayload<ProjectResponse>
      >(["projects"]);
      if (previousProjects) {
        queryClient.setQueryData<ResponsePayload<ProjectResponse>>(
          ["projects"],
          {
            ...previousProjects,
            result: {
              projects: previousProjects.result.projects.filter(
                (project) => project.id !== projectId,
              ),
              total: previousProjects.result.total,
              active: previousProjects.result.active,
            },
          },
        );
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
