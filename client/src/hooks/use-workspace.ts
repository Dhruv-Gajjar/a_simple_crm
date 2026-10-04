import { WorkspaceService } from "@/services/workspace.service";
import { useQuery } from "@tanstack/react-query";

const useWorkspace = () => {
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

  return {
    workspacesData,
    workspacesError,
    isWorkspacesLoading,
    isWorkspacesError,
  };
};

export default useWorkspace;
