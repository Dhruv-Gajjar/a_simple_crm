import { WorkspaceService } from "@/services/workspace.service";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useQuery } from "@tanstack/react-query";

const useWorkspace = () => {
  const workspaceId = useWorkspaceStore((state) => state.selectedWorkspaceId);

  const {
    data: workspacesData,
    isLoading: isWorkspacesLoading,
    isError: isWorkspacesError,
    error: workspacesError,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const workspaces = await WorkspaceService.getAllWorkspaces();

      return workspaces.result;
    },
  });

  const {
    data: workspaceData,
    isLoading: isWorkspaceLoading,
    isError: isWorkspaceError,
    error: workspaceError,
  } = useQuery({
    queryKey: ["workspaces", workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        console.log("ERROR_SERVICE: project id not found.!");
        throw new Error("Project ID not set.");
      }
      const workspace = await WorkspaceService.getWorkspaceById(workspaceId);
      return workspace;
    },
  });

  return {
    workspacesData,
    workspacesError,
    isWorkspacesLoading,
    isWorkspacesError,
    workspaceData,
    isWorkspaceLoading,
    isWorkspaceError,
    workspaceError,
  };
};

export default useWorkspace;
