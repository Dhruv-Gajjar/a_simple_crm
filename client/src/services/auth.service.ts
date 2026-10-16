import axiosInstance from "@/api";
import { AuthResponse, ResponsePayload, Signin, Signup, User } from "@/types";
import { isAxiosError } from "axios";

export const AuthService = {
  signup: async (
    payload: Signup,
  ): Promise<ResponsePayload<AuthResponse | null>> => {
    try {
      const response = await axiosInstance.post(`/auth/sign-up`, payload, {
        withCredentials: true,
      });
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
          error instanceof Error ? error.message : "Network error occurred",
        result: null,
      };
    }
  },
  signin: async (
    payload: Signin,
  ): Promise<ResponsePayload<AuthResponse | null>> => {
    try {
      const response = await axiosInstance.post(`/auth/sign-in`, payload, {
        withCredentials: true,
      });
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
          error instanceof Error ? error.message : "Network error occurred",
        result: null,
      };
    }
  },
  getCurrentUser: async (): Promise<ResponsePayload<User | null>> => {
    try {
      const result = await axiosInstance.get("/auth/me", {
        withCredentials: true,
      });
      return result.data;
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
          error instanceof Error ? error.message : "Network error occurred",
        result: null,
      };
    }
  },
  logout: async (): Promise<ResponsePayload<string | null>> => {
    try {
      const response = await axiosInstance.post(`/auth/logout`);

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
          error instanceof Error ? error.message : "Network error occurred",
        result: null,
      };
    }
  },
};
