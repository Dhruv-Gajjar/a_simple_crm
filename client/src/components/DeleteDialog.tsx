import { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useGlobalStore } from "@/stores/globalStore";
import { toast } from "sonner";
import { useClientStore } from "@/stores/clientStore";
import { useProjectStore } from "@/stores/projectStore";
import useClientManager from "@/hooks/use-client-manager";
import useProject from "@/hooks/use-project";
import { Spinner } from "./ui/spinner";

interface DeleteDialogProps {
  name: string;
}

const DeleteDialog: FC<DeleteDialogProps> = ({ name }) => {
  const isOpen = useGlobalStore((state) => state.isDeleteDialogOpen);
  const setOpen = useGlobalStore((state) => state.setOpenDeleteDialog);
  
  const clientID = useClientStore((state) => state.selectedClientID);
  const setClientID = useClientStore((state) => state.setClientID);
  const { deleteClient } = useClientManager();

  const selectedProjectId = useProjectStore((state) => state.selectedProjectId);
  const setSelectedProjectId = useProjectStore((state) => state.setSelectedProjectId);
  const { deleteProject } = useProject();

  const handleDelete = async () => {
    if (clientID) {
      deleteClient.mutate(clientID, {
        onSuccess: (data) => {
          setClientID("");
          toast.success(data?.message || "Client deleted successfully");
          setOpen();
        },
        onError(error) {
          toast.error(error?.message);
        },
      });
    } else if (selectedProjectId) {
      deleteProject.mutate(selectedProjectId, {
        onSuccess: (data) => {
          setSelectedProjectId("");
          toast.success(data?.message || "Project deleted successfully");
          setOpen();
        },
        onError(error) {
          toast.error(error?.message);
        },
      });
    }
  };

  const isPending = deleteClient.isPending || deleteProject.isPending;

  if (isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete:{" "}
            <b>{name.padStart(1)}</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setClientID("");
            setSelectedProjectId("");
            setOpen();
          }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
