"use client";

import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import type { projects } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import { useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { getFormattedTimeFromEpoch } from "@/lib/getFormattedTimeFromEpoch";
import { VisibilityState } from "@tanstack/react-table";
export const columns: ColumnDef<projects>[] = [
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
    accessorKey: "project_name",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
        </button>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "project_is_pitr_enabled",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PITR
        </button>
      );
    },
    cell: ({ cell }) => (cell.getValue() === 1 ? "Enabled" : "Disabled"),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "project_last_updated_on_caa",
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

export default function PITRTable() {
  const { data, isLoading, error } = useProjectsQuery();
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
          filterColumnName="project_name"
          filterDisplayText="project name"
          isSelectable={true}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      )}
    </>
  );
}
