import axiosInstance from "@/api";
import { mockClients } from "@/mockData";
import { Client, CLIENT_STATUS, NewClient } from "@/types";

export const ClientService = {
  getAllClients: async (page: number) => {
    const response = await axiosInstance.get(`client?page=${page}`);
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
