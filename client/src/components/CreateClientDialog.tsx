import { useClientStore } from "@/stores/clientStore";
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

const CreateClientDialog = () => {
  const isOpen = useClientStore((state) => state.isCreateClientModalOpen);
  const setOpen = useClientStore((state) => state.setOpenCreateClient);

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
          <Field orientation="horizontal">
            <DialogClose asChild>
              <Button
                className="w-30"
                variant="outline"
                onClick={() => setOpen()}
              >
                Close
              </Button>
            </DialogClose>
            <Button className="w-30" type="submit" form="form-client">
              Save
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;
