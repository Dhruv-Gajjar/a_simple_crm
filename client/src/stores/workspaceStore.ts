import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  selectedWorkspaceId: string;
  activeWorkspaceId: string | null;
  workspaceName: string;
};

type Action = {
  setSelectedWorkspaceId: (workspaceId: string) => void;
  setActiveWorkspaceId: (workspaceId: string | null) => void;
  setWorkspaceName: (workspaceName: string) => void;
};

export const useWorkspaceStore = create<State & Action>()(
  persist(
    (set) => ({
      selectedWorkspaceId: "",
      activeWorkspaceId: null,
      workspaceName: "",

      setSelectedWorkspaceId: (workspaceId: string) =>
        set({
          selectedWorkspaceId: workspaceId,
        }),

      setActiveWorkspaceId: (workspaceId: string | null) =>
        set({
          activeWorkspaceId: workspaceId,
        }),

      setWorkspaceName: (workspaceName: string) =>
        set({
          workspaceName: workspaceName,
        }),
    }),
    {
      name: "active-workspace-storage",
    },
  ),
);
