import axiosInstance from "@/api";
import { Client, NewClient } from "@/types";

export const ClientService = {
  getAllClients: async () => {
    const response = await axiosInstance.get("client/");
    return response.data;
  },
  createClient: async (body: NewClient) => {
    const response = await axiosInstance.post("client/", body);
    return response.data;
  },
  updateClient: async (body: Client) => {
    const response = await axiosInstance.patch(`client/${body.ID}`, body);
    return response.data;
  },
  deleteClient: async (clientID: string) => {
    const response = await axiosInstance.delete(`client/${clientID}`);
    return response.data;
  },
};
