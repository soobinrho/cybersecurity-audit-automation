"use client";

import type { evidence_images } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/ui/data-table";
import { useMemo, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { getFormattedTimeFromEpoch } from "@/lib/getFormattedTimeFromEpoch";
import { VisibilityState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import useEvidenceImagesQuery from "@/hooks/useEvidenceImagesQuery";
import useEvidenceImageBlobQuery from "@/hooks/useEvidenceImageBlob";

export const columns: ColumnDef<evidence_images>[] = [
  {
    accessorKey: "evidence_image_id",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
        </button>
      );
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "evidence_image_name",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
        </button>
      );
    },
    sortingFn: "text",
  },
  {
    accessorKey: "evidence_what_for",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Purpose
        </button>
      );
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "evidence_image_size",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
        </button>
      );
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "evidence_image_last_updated_on_caa",
    header: ({ column }) => {
      return (
        <button
          className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
        </button>
      );
    },
    cell: ({ cell }) => {
      const value = cell.getValue();
      return getFormattedTimeFromEpoch(value as number);
    },
    sortingFn: "datetime",
  },
  {
    accessorKey: "evidence_image_blob",
    header: "Image File",
    cell: function useEvidenceImageBlob({ cell }) {
      const { data, error, isLoading } = useEvidenceImageBlobQuery(
        cell.getContext().row.original.evidence_image_id as number
      );
      return (
        <>
          {isLoading ? (
            <Button variant="outline" disabled>
              <div className="flex gap-1">
                <div className="w-0.5 h-0.5 bg-primary/40 rounded-full animate-bounce" />
                <div className="w-0.5 h-0.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-0.5 h-0.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                if (data) {
                  const image = data;
                  const url = URL.createObjectURL(image);
                  window.open(url, "_blank");
                }
              }}
            >
              View
            </Button>
          )}
          {error && (
            <Button variant="outline" disabled>
              Error
            </Button>
          )}
        </>
      );
    },
    enableSorting: false,
  },
];

export default function EvidenceImagesTable() {
  const { data, error, isLoading } = useEvidenceImagesQuery();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    evidence_image_id: false,
    evidence_image_name: true,
    evidence_what_for: true,
    evidence_image_size: false,
    evidence_image_created_on_caa: true,
    evidence_image_blob: true,
  });
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
          filterColumnName="evidence_image_name"
          filterDisplayText="image name"
          isSelectable={false}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
      )}
    </>
  );
}
