import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field } from "./ui/field";
import { Button } from "./ui/button";
import ClientForm from "./ClientForm";
import { useGlobalStore } from "@/stores/globalStore";
import { useClientStore } from "@/stores/clientStore";

const CreateClientDialog = () => {
  const isOpen = useGlobalStore((state) => state.isClientDialogOpen);
  const setOpen = useGlobalStore((state) => state.setOpenClientDialog);
  const setIsEdit = useGlobalStore((state) => state.setIsEditMode);

  const setClientID = useClientStore((state) => state.setClientID);

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Client Form</DialogTitle>
          <DialogDescription>
            Fill this form to add a new client.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] rounded-sm overflow-y-auto px-4">
          <ClientForm />
        </div>
        <DialogFooter>
          <Field
            orientation="horizontal"
            className="flex items-center justify-end"
          >
            <Button className="w-30" type="submit" form="form-client">
              Save
            </Button>
            <DialogClose asChild>
              <Button
                className="w-30"
                variant="outline"
                onClick={() => {
                  setIsEdit();
                  setClientID("");
                  setOpen();
                }}
              >
                Close
              </Button>
            </DialogClose>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;
