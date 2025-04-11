"use client";

import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import { useSession } from "next-auth/react";
import type { projects } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import { useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { getFormattedTimeFromEpoch } from "@/lib/getFormattedTimeFromEpoch";
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
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "project_is_pitr_enabled",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PITR
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => (cell.getValue() === 1 ? "Enabled" : "Disabled"),
  },
  {
    accessorKey: "project_last_updated_on_caa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const value = cell.getValue();
      return getFormattedTimeFromEpoch(value as number);
    },
  },
];

export default function MFATable() {
  const { data: session } = useSession();
  const userAuthenticatedID = session?.user?.id as string;
  const { data, isLoading } = useProjectsQuery(userAuthenticatedID);

  const filteredData = useMemo(() => data ?? [], [data]);

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
          filterColumnName="project_name"
          filterDisplayText="project name"
          isSelectable={true}
        />
      )}
    </>
  );
}
