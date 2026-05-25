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
import useClientManager from "@/hooks/use-client-manager";
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

  const handleDelete = async () => {
    if (clientID) {
      deleteClient.mutate(clientID, {
        onSuccess: (data) => {
          setClientID("");
          toast.success(data?.message);
          setOpen();
        },
        onError(error) {
          toast.error(error?.message);
        },
      });
    }
  };

  if (deleteClient.isPending) {
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
          <AlertDialogCancel onClick={() => setOpen()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
