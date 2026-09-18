import axiosInstance from "@/api";
import { Client, NewClient, ResponsePayload } from "@/types";

export const ClientService = {
  getAllClients: async (page: number): Promise<ResponsePayload<Client[]>> => {
    const response = await axiosInstance.get(`client`);
    return response.data;
  },
  getClientById: async (id: string): Promise<ResponsePayload<Client>> => {
    const response = await axiosInstance.get(`client/${id}`);
    return response.data;
  },
  createClient: async (body: NewClient): Promise<ResponsePayload<Client>> => {
    const response = await axiosInstance.post("client/", body);
    return response.data;
  },
  updateClient: async (body: Client): Promise<ResponsePayload<Client>> => {
    const response = await axiosInstance.patch(`client/${body.id}`, body);
    return response.data;
  },
  deleteClient: async (clientID: string): Promise<boolean> => {
    const response = await axiosInstance.delete(`client/${clientID}`);
    return response.data;
  },
};
