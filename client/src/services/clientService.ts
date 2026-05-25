import axiosInstance from "@/api";
import { mockClients } from "@/mockData";
import { Client, CLIENT_STATUS, NewClient } from "@/types";

export const ClientService = {
  getAllClients: async (page: number) => {
    // // 1. Simulate a 500ms network delay so you can test loading states (Spinner)
    // await new Promise((resolve) => setTimeout(resolve, 500));

    // // 2. Handle the pagination math locally
    // const limit = 10;
    // const startIndex = (page - 1) * limit;
    // const endIndex = startIndex + limit;
    // const paginatedClients = mockClients.slice(startIndex, endIndex);

    // // 3. Calculate active clients for your dashboard metrics
    // const activeClientsCount = mockClients.filter(
    //   (client) => client.status === CLIENT_STATUS.Active,
    // ).length;

    // // 4. Return the exact JSON structure your Go backend usually provides
    // return {
    //   clients: paginatedClients,
    //   message: "Mock clients fetched successfully!",
    //   total_clients: mockClients.length,
    //   active_clients: activeClientsCount,
    // };
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
