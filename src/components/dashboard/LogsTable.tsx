"use client";

import { useState, useMemo } from "react";
import { useLogsQuery } from "@/hooks/useLogsQuery";
import type { logs } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getFormattedTimeFromTimestamp } from "@/lib/getFormattedTimeFromEpoch";
import { VisibilityState } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<logs>[] = [
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
    accessorKey: "log_id",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          log_id
        </button>
      );
    },
    sortingFn: "basic",
    enableSorting: true,
  },
  {
    accessorKey: "MSG",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          MSG
        </button>
      );
    },
    sortingFn: "text",
    enableSorting: true,
  },
  {
    accessorKey: "org_id_fk",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          org_id_fk
        </button>
      );
    },
    sortingFn: "text",
    enableSorting: true,
  },
  {
    accessorKey: "user_email_fk",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          user_email_fk
        </button>
      );
    },
    sortingFn: "text",
    enableSorting: true,
  },
  {
    accessorKey: "project_id_fk",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          project_id_fk
        </button>
      );
    },
    sortingFn: "text",
    enableSorting: true,
  },
  {
    accessorKey: "table_name_fk",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          table_name_fk
        </button>
      );
    },
    sortingFn: "text",
    enableSorting: true,
  },
  {
    accessorKey: "evidence_image_id_fk",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          evidence_image_id_fk
        </button>
      );
    },
    sortingFn: "basic",
    enableSorting: true,
  },
  {
    accessorKey: "PRI_FACILITY",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PRI_FACILITY
        </button>
      );
    },
    sortingFn: "basic",
    enableSorting: true,
  },
  {
    accessorKey: "PRI_SEVERITY",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PRI_SEVERITY
        </button>
      );
    },
    sortingFn: "basic",
    enableSorting: true,
  },
  {
    accessorKey: "VER",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          VER
        </button>
      );
    },
    sortingFn: "basic",
    enableSorting: true,
  },
  {
    accessorKey: "TIMESTAMP",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TIMESTAMP
          <br />
          (Browser Local Time)
        </button>
      );
    },
    cell: ({ cell }) => {
      const value = cell.getValue();
      return getFormattedTimeFromTimestamp(value as string);
    },
    sortingFn: "datetime",
    enableSorting: true,
  },
  {
    accessorKey: "HOSTNAME",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          HOSTNAME
        </button>
      );
    },
    sortingFn: "text",
    enableSorting: true,
  },
  {
    accessorKey: "APPNAME",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          APPNAME
        </button>
      );
    },
    sortingFn: "text",
    enableSorting: true,
  },
  {
    accessorKey: "PROCID",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PROCID
        </button>
      );
    },
    sortingFn: "text",
    enableSorting: true,
  },
];

export default function LogsTable() {
  const { data, error, isLoading } = useLogsQuery();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    log_id: false,
    org_id_fk: false,
    user_email_fk: false,
    project_id_fk: false,
    table_name_fk: false,
    evidence_image_id_fk: false,
    PRI_FACILITY: false,
    PRI_SEVERITY: false,
    VER: false,
    TIMESTAMP: true,
    HOSTNAME: false,
    APPNAME: false,
    PROCID: false,
    MSG: true,
  });
  const filteredData = useMemo(() => data ?? [], [data]);
  if (error) {
    return <h2>{error.message}</h2>;
  }
  return (
    <>
      {isLoading ? (
        <div>
          <Skeleton className="w-full h-[400px] rounded-md" />
          <Skeleton className="h-10 w-full mt-4 rounded-md" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData || []}
          filterColumnName="MSG"
          filterDisplayText="message"
          isSelectable={true}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      )}
    </>
  );
}
