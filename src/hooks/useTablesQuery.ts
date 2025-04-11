import { useQuery } from "@tanstack/react-query";
import { getTables } from "@/lib/getTables";

export const useTablesQuery = (authentiactedUserId: string | undefined) => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: () => getTables(authentiactedUserId),
  });
};
