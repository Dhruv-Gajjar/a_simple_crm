import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="px-8 py-6">
        <Link href={"/"} className="flex items-center">
          <Button variant="ghost">
            <ChevronLeft />
            Back to app
          </Button>
        </Link>
      </header>
      <main className="flex flex-1 h-screen w-full items-center justify-center p-4 mx-auto">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </>
  );
}
