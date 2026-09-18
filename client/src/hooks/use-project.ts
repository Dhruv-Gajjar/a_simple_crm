import { ProjectService } from "@/services/project.service";
import { useGlobalStore } from "@/stores/globalStore";
import { useProjectStore } from "@/stores/projectStore";
import { NewProject, Project, ResponsePayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useProject = () => {
  const queryClient = useQueryClient();

  const page = useGlobalStore((state) => state.page);
  const projectId = useProjectStore((state) => state.selectedProjectId);

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

  const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
    error: projectError,
  } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      if (!projectId) {
        console.log("ERROR_SERVICE: project id not found.!");
        throw new Error("Project ID not set.");
      }
      const project = await ProjectService.getProjectByID(projectId);
      return project;
    },
  });

  const createNewProject = useMutation({
    mutationKey: ["create_project"],
    mutationFn: ProjectService.createProject,
    onMutate: async (newProject: NewProject) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previousProjects = queryClient.getQueryData<
        ResponsePayload<Project[]>
      >(["projects"]);
      if (previousProjects) {
        queryClient.setQueryData(["projects"], {
          ...previousProjects,
          result: {
            projects: [...previousProjects.result, newProject as Project],
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
        ResponsePayload<Project[]>
      >(["projects"]);
      if (previousProjects) {
        queryClient.setQueryData<ResponsePayload<Project[]>>(["projects"], {
          ...previousProjects,
          result: previousProjects.result.map((project) =>
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
      const previousProjects = queryClient.getQueryData<
        ResponsePayload<Project[]>
      >(["projects"]);
      if (previousProjects) {
        queryClient.setQueryData<ResponsePayload<Project[]>>(["projects"], {
          ...previousProjects,
          result: previousProjects.result.filter(
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
    projectData,
    isProjectLoading,
    isProjectError,
    projectError,
    createNewProject,
    updateProject,
    deleteProject,
  };
};

export default useProject;
