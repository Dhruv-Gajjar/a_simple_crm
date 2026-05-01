import axiosInstance from "@/api";
import { NewClient } from "@/types";

export const ClientService = {
  getAllClients: async () => {
    const response = await axiosInstance.get("client/");
    return response.data;
  },
  createClient: async (body: NewClient) => {
    console.log("body: ", body);
    const response = await axiosInstance.post("client/", body);
    return response.data;
  },
};
