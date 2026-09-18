import { ClientService } from "@/services/client.service";
import { useClientStore } from "@/stores/clientStore";
import { useGlobalStore } from "@/stores/globalStore";
import { Client, NewClient, ResponsePayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    queryKey: ["clients", clientId],
    queryFn: async () => {
      if (!clientId) {
        console.log("ERROR_SERVICE: client id not found.!");
        throw new Error("Client ID not set.");
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
      const previousClients = queryClient.getQueryData<
        ResponsePayload<Client[]>
      >(["clients"]);
      if (previousClients) {
        queryClient.setQueryData<ResponsePayload<Client[]>>(["clients"], {
          ...previousClients,
          result: [...previousClients.result, newClient as Client],
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
      const previousClients = queryClient.getQueryData<
        ResponsePayload<Client[]>
      >(["clients"]);
      if (previousClients) {
        queryClient.setQueryData<ResponsePayload<Client[]>>(["clients"], {
          ...previousClients,
          result: previousClients.result.map((client) =>
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
      const previousClients = queryClient.getQueryData<
        ResponsePayload<Client[]>
      >(["clients"]);
      if (previousClients) {
        queryClient.setQueryData<ResponsePayload<Client[]>>(["clients"], {
          ...previousClients,
          result: previousClients.result.filter(
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
