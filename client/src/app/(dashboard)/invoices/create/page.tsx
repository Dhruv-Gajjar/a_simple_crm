import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CircleAlert, PlusCircle, Send } from "lucide-react";

const CreateInvoice = () => {
  return (
    <div className="py-2 w-full">
      <div className="flex items-center w-full justify-between">
        <h2 className="text-2xl font-semibold">Create Invoice</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="show-preview">Show Preview</Label>
            <Switch id="show-preview" defaultChecked />
          </div>
          <Button variant="outline">Save as Draft</Button>
          <Button>
            <Send />
            Send Invoice
          </Button>
        </div>
      </div>
      <p className="text-xs text-gray-400 flex items-center gap-2 py-1">
        <CircleAlert size={16} />
        <span>
          You can save unfinished invoice as drafe and complete later.
        </span>
      </p>
      <div className="grid grid-cols-2 gap-6 items-center pt-2">
        <InvoiceForm />
        <InvoicePreview />
      </div>
    </div>
  );
};

export default CreateInvoice;
