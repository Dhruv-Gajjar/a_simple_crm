import { ClientService } from "@/services/clientService";
import { Client, NewClient } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useClientManager = () => {
  const queryClient = useQueryClient();

  const {
    data: clients,
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
    mutationFn: ClientService.createClient,
    onSettled: (data, error, variables, onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ["clients"] }),
  });

  return {
    clients,
    isClientsLoading,
    isClientsError,
    clientsError,
    createNewClient,
  };
};

export default useClientManager;
