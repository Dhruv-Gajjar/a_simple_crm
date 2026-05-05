import { ClientService } from "@/services/clientService";
import { Client, NewClient } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ClientResponse = {
  clients: Client[];
  message: string;
  total_clients: number;
  active_clients: number;
};

const useClientManager = () => {
  const queryClient = useQueryClient();

  const {
    data: clientsData,
    isLoading: isClientsLoading,
    isError: isClientsError,
    error: clientsError,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const client = await ClientService.getAllClients();
      return client;
    },
  });

  const createNewClient = useMutation({
    mutationKey: ["create_client"],
    mutationFn: ClientService.createClient,
    onMutate: async (newClient: NewClient) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      const previousClients = queryClient.getQueryData<ClientResponse>([
        "clients",
      ]);
      if (previousClients) {
        queryClient.setQueryData<ClientResponse>(["clients"], {
          ...previousClients,
          clients: [...previousClients.clients, newClient as Client],
        });
      }
      return { previousClients };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["clients"], context?.previousClients);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const updateClient = useMutation({
    mutationKey: ["update_client"],
    mutationFn: ClientService.updateClient,
    onMutate: async (updateClient: Client) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      const previousClients = queryClient.getQueryData<ClientResponse>([
        "clients",
      ]);
      if (previousClients) {
        queryClient.setQueryData<ClientResponse>(["clients"], {
          ...previousClients,
          clients: previousClients.clients.map((client) =>
            client.ID === updateClient.ID ? updateClient : client,
          ),
        });
      }
      return { previousClients };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["clients"], context?.previousClients);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const deleteClient = useMutation({
    mutationFn: ClientService.deleteClient,
    onMutate: async (clientID: string) => {
      await queryClient.cancelQueries({ queryKey: ["clients"] });
      const previousClients = queryClient.getQueryData<ClientResponse>([
        "clients",
      ]);
      if (previousClients) {
        queryClient.setQueryData<ClientResponse>(["clients"], {
          ...previousClients,
          clients: previousClients.clients.filter(
            (client) => client.ID != clientID,
          ),
        });
      }
      return { previousClients };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["clients"], context?.previousClients);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  return {
    clientsData,
    isClientsLoading,
    isClientsError,
    clientsError,
    createNewClient,
    updateClient,
    deleteClient,
  };
};

export default useClientManager;
