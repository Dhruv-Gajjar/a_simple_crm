import { ClientService } from "@/services/client.service";
import { useClientStore } from "@/stores/clientStore";
import { useGlobalStore } from "@/stores/globalStore";
import { Client, NewClient } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ClientResponse = {
  clients: Client[];
  message: string;
  total_clients: number;
  active_clients: number;
};

const useClientManager = () => {
  const page = useGlobalStore((state) => state.page);
  const queryClient = useQueryClient();
  const clientId = useClientStore((state) => state.selectedClientID);

  if (!clientId) {
    console.log("CLIENT ID INVALID, PROVIDE A CLIENT ID.");
  }

  const {
    data: clientsData,
    isLoading: isClientsLoading,
    isError: isClientsError,
    error: clientsError,
  } = useQuery({
    queryKey: ["clients", page ?? ""],
    queryFn: async () => {
      const clients = await ClientService.getAllClients(page);
      return clients;
    },
  });

  const {
    data: clientData,
    isLoading: isClientLoading,
    isError: isClientError,
    error: clientError,
  } = useQuery({
    queryKey: ["clients", clientId ?? ""],
    queryFn: async () => {
      if (!clientId) {
        console.log("ERROR_SERVICE: client id not found.!");
        return [];
      }
      const client = await ClientService.getClientById(clientId);
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
            client.id === updateClient.id ? updateClient : client,
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
            (client) => client.id != clientID,
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
    clientData,
    isClientLoading,
    isClientError,
    clientError,
    createNewClient,
    updateClient,
    deleteClient,
  };
};

export default useClientManager;
