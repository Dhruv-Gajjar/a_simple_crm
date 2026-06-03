"use client";

import { CLIENT_STATUS } from "@/types";
import { type Table } from "@tanstack/react-table";
import {
  CircleAlert,
  CircleCheckBig,
  CircleOff,
  ClockFading,
  PlusCircle,
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import { DataTableFilter } from "./data-table-filter";
import { Button } from "../ui/button";
import { ReactNode } from "react";

const clientStatus = [
  {
    value: CLIENT_STATUS.Active,
    icon: CircleCheckBig,
    label: "Active",
  },
  {
    value: CLIENT_STATUS.InActive,
    icon: CircleAlert,
    label: "In Active",
  },

  {
    value: CLIENT_STATUS.Lead,
    icon: ClockFading,
    label: "Lead",
  },

  {
    value: CLIENT_STATUS.Rejected,
    icon: CircleOff,
    label: "Rejected",
  },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  inputPlaceholder: string;
  addButtonText: string;
  actions: ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  inputPlaceholder,
  addButtonText,
  actions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder={inputPlaceholder}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-36 lg:w-60"
        />
        {table.getColumn("status") && (
          <DataTableFilter
            column={table.getColumn("status")}
            title="Status"
            options={clientStatus}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/*<DataTableViewOptions table={table} />*/}
        {/*<Button size="sm">
          <PlusCircle /> {addButtonText}
        </Button>*/}
        {actions}
      </div>
    </div>
  );
}
