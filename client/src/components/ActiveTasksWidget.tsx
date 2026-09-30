import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";

export function ActiveTasksWidget() {
  return (
    <Card className="w-full col-span-4">
      <CardHeader>
        <CardTitle className="text-xl">Priority Tasks</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-hidden w-full">
        <div className="-mx-4 no-scrollbar max-h-[50vh] rounded-sm overflow-y-auto px-4 space-y-2">
          <Card>
            <CardContent className="flex items-center gap-2">
              <LoaderCircle className="text-primary" size={18} />
              <p>Redesign the CRM dashboard.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 overflow-hidden">
              <LoaderCircle className="text-primary" size={18} />
              <p>Follow up on New Client lead.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 overflow-hidden">
              <LoaderCircle className="text-primary" size={18} />
              <p>Contact Test Client for pending invoice payment.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 overflow-hidden">
              <LoaderCircle className="text-primary" size={18} />
              <p>Contact Test Client for pending invoice payment.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 overflow-hidden">
              <LoaderCircle className="text-primary" size={18} />
              <p>Contact Test Client for pending invoice payment.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 overflow-hidden">
              <LoaderCircle className="text-primary" size={18} />
              <p>Contact Test Client for pending invoice payment.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 overflow-hidden">
              <LoaderCircle className="text-primary" size={18} />
              <p>Contact Test Client for pending invoice payment.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-2 overflow-hidden">
              <LoaderCircle className="text-primary" size={18} />
              <p>Contact Test Client for pending invoice payment.</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
