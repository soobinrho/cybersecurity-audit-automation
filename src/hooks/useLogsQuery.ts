import { useQuery } from "@tanstack/react-query";
import { getLogs } from "@/lib/getLogs";

export const useLogsQuery = (authentiactedUserId: string | undefined) => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: () => getLogs(authentiactedUserId),
    refetchInterval: 500,
    refetchIntervalInBackground: true,
  });
};
