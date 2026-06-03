import { create } from "zustand";

type State = {
  selectedProjectId: string;
  projectName: string;
};

type Action = {
  setSelectedProjectId: (projectId: string) => void;
  setProjectName: (projectName: string) => void;
};

export const useProjectStore = create<State & Action>((set) => ({
  selectedProjectId: "",
  projectName: "",

  setSelectedProjectId: (projectId: string) =>
    set({
      selectedProjectId: projectId,
    }),

  setProjectName: (projectName: string) =>
    set({
      projectName: projectName,
    }),
}));
