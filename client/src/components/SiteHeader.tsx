"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth-context";
import { usePathname } from "next/navigation";
import { Spinner } from "./ui/spinner";

export function SiteHeader() {
  const pathname = usePathname();
  const title = pathname.split("/");
  const { user, isLoading } = useAuth();
  console.log(pathname, title);

  if (isLoading) {
    return;
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium capitalize">{title[1] === "" ? "Dashboard" : title[1]}</h1>
        <div className="ml-auto flex items-center gap-2">
          <p className="">Welcome, {user && user?.username}</p>
        </div>
      </div>
    </header>
  );
}
