import { FC, ReactNode } from "react";
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

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  formId: string;
  submitButtonText?: string;
  children: ReactNode;
}

export const FormDialog: FC<FormDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  formId,
  submitButtonText = "Save",
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] rounded-sm overflow-y-auto px-4">
          {children}
        </div>
        <DialogFooter>
          <Field
            orientation="horizontal"
            className="flex items-center justify-end"
          >
            <Button className="w-30" type="submit" form={formId}>
              {submitButtonText}
            </Button>
            <DialogClose asChild>
              <Button className="w-30" variant="outline">
                Close
              </Button>
            </DialogClose>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
