"use client";

import { useLogsQuery } from "@/hooks/useLogsQuery";
import { useSession } from "next-auth/react";
import type { logs } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getFormattedTimeFromTimestamp } from "@/lib/getFormattedTimeFromEpoch";
export const columns: ColumnDef<logs>[] = [
  {
    accessorKey: "MSG",
    header: "Message",
  },
  {
    accessorKey: "TIMESTAMP",
    header: "Timestamp (Browser Local Time)",
    cell: ({ cell }) => {
      const value = cell.getValue();
      return getFormattedTimeFromTimestamp(value as string);
    },
  },
];

export default function LogsTable() {
  const { data: session } = useSession();
  const userAuthenticatedID = session?.user?.id || "";
  const { data, isLoading } = useLogsQuery(userAuthenticatedID);

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
          filterColumnName="MSG"
          filterDisplayText="message"
        />
      )}
    </>
  );
}
