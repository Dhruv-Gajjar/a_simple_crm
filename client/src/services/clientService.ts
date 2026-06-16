import axiosInstance from "@/api";
import { mockClients } from "@/mockData";
import { Client, CLIENT_STATUS, NewClient } from "@/types";

export const ClientService = {
  getAllClients: async (page: number) => {
    const response = await axiosInstance.get(`client`);
    return response.data;
  },
  getClientById: async (id: string) => {
    const response = await axiosInstance.get(`client/${id}`);
    return response.data;
  },
  createClient: async (body: NewClient) => {
    const response = await axiosInstance.post("client/", body);
    return response.data;
  },
  updateClient: async (body: Client) => {
    const response = await axiosInstance.patch(`client/${body.id}`, body);
    return response.data;
  },
  deleteClient: async (clientID: string) => {
    const response = await axiosInstance.delete(`client/${clientID}`);
    return response.data;
  },
};
