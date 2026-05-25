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
import { mockClients } from "@/mockData";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPagination: boolean;
  nextPage?: () => void;
  previousPage?: () => void;
  currentPage?: number;
  pageCount?: number;
  isEndOfData?: boolean;
}

export function AppDataTable<TData, TValue>({
  columns,
  data,
  isPagination = false,
  nextPage,
  previousPage,
  currentPage,
  pageCount,
  isEndOfData,
}: DataTableProps<TData, TValue>) {
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

  return (
    <div>
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
