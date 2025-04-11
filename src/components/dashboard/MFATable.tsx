"use client";

import { useUsersQuery } from "@/hooks/useUsersQuery";
import type { users } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import { useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { getFormattedTimeFromEpoch } from "@/lib/getFormattedTimeFromEpoch";
import { VisibilityState } from "@tanstack/react-table";
export const columns: ColumnDef<users>[] = [
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
    accessorKey: "user_email",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Email
        </button>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "user_is_mfa_enabled",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          MFA
        </button>
      );
    },
    cell: ({ cell }) => (cell.getValue() === 1 ? "Enabled" : "Disabled"),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "user_last_updated_on_caa",
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

export default function MFATable() {
  const { data, error, isLoading } = useUsersQuery();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const filteredData = useMemo(() => data ?? [], [data]);
  if (error) {
    return <h2>{error.message}</h2>;
  }
  return (
    <>
      {isLoading ? (
        <div>
          <Skeleton className="w-full h-full rounded-4xl" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData || []}
          filterColumnName="user_email"
          filterDisplayText="email"
          isSelectable={true}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      )}
    </>
  );
}
