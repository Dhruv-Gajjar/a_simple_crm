import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

const InvoicePreview = () => {
  return (
    <Card className="-mx-2 no-scrollbar max-h-[95vh] rounded-sm overflow-y-auto shadow h-[95vh] ">
      <CardHeader>
        <CardTitle className="text-2xl">Invoice</CardTitle>
        <CardDescription className="text-[14px]">
          Invoice Number - #260613
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="flex items-center justify-between">
          <div className="text-gray-500">
            <p>Billed from:</p>
            <p className="font-semibold text-black">Current User</p>
            <p>current_user@email.com</p>
            <p>+11 1234567890</p>
          </div>
          <div className="text-gray-500">
            <p>Billed to:</p>
            <p className="font-semibold text-black">Client Name</p>
            <p>client@email.com</p>
            <p>+11 1234567890</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="text-gray-600">
            <p>Issued Date:</p>
            <p className="font-semibold text-black">Jun 13, 2026</p>
          </div>
          <div className="text-gray-600">
            <p>Due Date:</p>
            <p className="font-semibold text-black">Jun 13, 2026</p>
          </div>
        </div>
        <Separator orientation="horizontal" className="my-2" />
        <div className="mt-4">
          <div className="grid grid-cols-4 gap-4 border-b bg-muted/50 p-3 font-medium">
            <div>Item</div>
            <div>Qty</div>
            <div>Price</div>
            <div className="text-right">Amount</div>
          </div>
          <div
            // key={index}
            className="grid grid-cols-4 gap-4 border-b p-3"
          >
            <div>Item 1</div>
            <div>2</div>
            <div>$ 500</div>
            <div className="text-right">$ {2 * 500}</div>
          </div>
          <div
            // key={index}
            className="grid grid-cols-4 gap-4 border-b p-3"
          >
            <div>Item 1</div>
            <div>1</div>
            <div>$ 500</div>
            <div className="text-right">$ {1 * 500}</div>
          </div>
        </div>

        <div className="flex justify-end my-4">
          <div className="w-full max-w-52 grid grid-cols-2 gap-y-2 items-end text-gray-600">
            <div>Subtotal</div>
            <div>1500</div>

            <div>Tax</div>
            <div>10% ($150)</div>

            <div>Discount</div>
            <div>$ 0.00</div>

            <div className="font-semibold text-black">TOTAL</div>
            <div className="font-semibold text-black">$ 1650</div>
          </div>
        </div>
        <div className="border rounded-lg p-2">
          <p className="text-gray-600">
            <span>Note: </span> Thank you for your trust. Please complete this
            payment before the due date. For any questions, feel free to contact
            us.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreview;
