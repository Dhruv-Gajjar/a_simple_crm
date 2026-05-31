"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CLIENT_STATUS } from "@/types";
import { toast } from "sonner";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPagination: boolean;
  nextPage?: () => void;
  previousPage?: () => void;
  currentPage?: number;
  pageCount?: number;
  isEndOfData?: boolean;
  canShowOptions?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

const dataTableSchema = z.object({
  searchString: z.string(),
  status: z.array(
    z.enum([
      CLIENT_STATUS.Active,
      CLIENT_STATUS.InActive,
      CLIENT_STATUS.Lead,
      CLIENT_STATUS.Rejected,
    ]),
  ),
});

const defaultValues = {
  searchString: "",
  status: [],
};

export function AppDataTable<TData, TValue>({
  columns,
  data,
  isPagination = false,
  nextPage,
  previousPage,
  currentPage,
  pageCount,
  isEndOfData,
  canShowOptions = false,
  showAddButton = false,
  onAddClick,
}: DataTableProps<TData, TValue>) {
  const form = useForm({
    resolver: zodResolver(dataTableSchema),
    defaultValues: defaultValues,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const isPreviousDisabled =
    currentPage !== undefined ? currentPage <= 1 : !table.getCanPreviousPage();

  const isNextDisabled =
    isEndOfData ||
    (pageCount !== undefined && pageCount !== -1 && currentPage !== undefined
      ? currentPage >= pageCount
      : !table.getCanNextPage());

  function onSubmit(data: z.infer<typeof dataTableSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-black">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
    });
    form.reset();
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar table={table} inputPlaceholder="Filter clients..." />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isPagination && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
            disabled={isPreviousDisabled}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={isNextDisabled}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
