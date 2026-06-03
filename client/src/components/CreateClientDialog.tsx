import ClientForm from "./ClientForm";
import { useGlobalStore } from "@/stores/globalStore";
import { useClientStore } from "@/stores/clientStore";
import { FormDialog } from "./FormDialog";

const CreateClientDialog = () => {
  const isOpen = useGlobalStore((state) => state.isClientDialogOpen);
  const setOpen = useGlobalStore((state) => state.setOpenClientDialog);
  const setIsEdit = useGlobalStore((state) => state.setIsEditMode);

  const setClientID = useClientStore((state) => state.setClientID);

  const handleClose = () => {
    setIsEdit();
    setClientID("");
    setOpen();
  };

  return (
    <FormDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Create client form"
      formId="form-client"
      description="Fill this form to create a new client."
    >
      <ClientForm />
    </FormDialog>
  );
};

export default CreateClientDialog;
