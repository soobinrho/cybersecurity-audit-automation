"use client";

import { useTablesQuery } from "@/hooks/useTablesQuery";
import type { tables } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import { useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { getFormattedTimeFromEpoch } from "@/lib/getFormattedTimeFromEpoch";
import { VisibilityState } from "@tanstack/react-table";
export const columns: ColumnDef<tables>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "table_name",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Table Name
        </button>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "table_is_rls_enabled",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RLS
        </button>
      );
    },
    cell: ({ cell }) => (cell.getValue() === 1 ? "Enabled" : "Disabled"),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "table_last_updated_on_caa",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
        </button>
      );
    },
    cell: ({ cell }) => {
      const value = cell.getValue();
      return getFormattedTimeFromEpoch(value as number);
    },
    sortingFn: "datetime",
  },
];

export default function RLSTable() {
  const { data, isLoading, error } = useTablesQuery();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const filteredData = useMemo(() => data ?? [], [data]);
  if (error) {
    return (
      <div>
        <Skeleton className="w-full h-32 rounded-md flex justify-center items-center">
          <h2>{error.message}</h2>
        </Skeleton>
      </div>
    );
  }
  return (
    <>
      {isLoading ? (
        <div>
          <Skeleton className="w-full h-32 rounded-md" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData || []}
          filterColumnName="table_name"
          filterDisplayText="table name"
          isSelectable={true}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      )}
    </>
  );
}
