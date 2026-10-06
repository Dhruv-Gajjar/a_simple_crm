import axiosInstance from "@/api";
import { NewWorkspace, ResponsePayload, Workspace } from "@/types";
import { isAxiosError } from "axios";

export const WorkspaceService = {
  createWorkspace: async (
    payload: NewWorkspace,
  ): Promise<ResponsePayload<Workspace | null>> => {
    try {
      const response = await axiosInstance.post(`/workspace`, payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const response = error.response.data;

        return {
          error: response.error,
          message: response.message,
          result: null,
        };
      }

      return {
        error: true,
        message:
          error instanceof Error ? error.message : "Network error occured",
        result: null,
      };
    }
  },
  updateWorkspace: async (
    payload: Workspace,
  ): Promise<ResponsePayload<Workspace | null>> => {
    try {
      const response = await axiosInstance.patch(`/workspace`, payload);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const response = error.response.data;

        return {
          error: response.error,
          message: response.message,
          result: null,
        };
      }

      return {
        error: true,
        message:
          error instanceof Error ? error.message : "Network error occured",
        result: null,
      };
    }
  },
  getAllWorkspaces: async (): Promise<ResponsePayload<Workspace[] | null>> => {
    try {
      const response = await axiosInstance.get(`/workspace`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const response = error.response.data;

        return {
          error: response.error,
          message: response.message,
          result: null,
        };
      }

      return {
        error: true,
        message:
          error instanceof Error ? error.message : "Network error occured",
        result: null,
      };
    }
  },
  getWorkspaceById: async (
    id: string,
  ): Promise<ResponsePayload<Workspace | null>> => {
    try {
      const response = await axiosInstance.get(`/workspace/${id}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const response = error.response.data;

        return {
          error: response.error,
          message: response.message,
          result: null,
        };
      }

      return {
        error: true,
        message:
          error instanceof Error ? error.message : "Network error occured",
        result: null,
      };
    }
  },
  deleteWorkspace: async (
    id: string,
  ): Promise<ResponsePayload<Workspace | null>> => {
    try {
      const response = await axiosInstance.delete(`/workspace/${id}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const response = error.response.data;

        return {
          error: response.error,
          message: response.message,
          result: null,
        };
      }

      return {
        error: true,
        message:
          error instanceof Error ? error.message : "Network error occured",
        result: null,
      };
    }
  },
  checkSlugAvailability: async (
    slug: string,
  ): Promise<ResponsePayload<string | null>> => {
    try {
      const response = await axiosInstance.get(
        `/workspace/check-slug/${slug}`,
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        const response = error.response.data;

        return {
          error: response.error,
          message: response.message,
          result: null,
        };
      }

      return {
        error: true,
        message:
          error instanceof Error ? error.message : "Network error occured",
        result: null,
      };
    }
  },
};
