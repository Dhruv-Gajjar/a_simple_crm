import axiosInstance from "@/api";
import { NewProject, Project, ProjectResponse, ResponsePayload } from "@/types";

export const ProjectService = {
  getAllProjects: async (
    _page: number,
  ): Promise<ResponsePayload<ProjectResponse>> => {
    const response = await axiosInstance.get(`project/`);
    return response.data;
  },
  createProject: async (
    newProject: NewProject,
  ): Promise<ResponsePayload<Project>> => {
    const response = await axiosInstance.post("project/", newProject);
    return response.data;
  },
  updateProject: async (body: Project): Promise<ResponsePayload<Project>> => {
    const response = await axiosInstance.patch(`project/${body.id}`, body);
    return response.data;
  },
  deleteProject: async (
    projectId: string,
  ): Promise<ResponsePayload<boolean>> => {
    const response = await axiosInstance.delete(`project/${projectId}`);
    return response.data;
  },
};
