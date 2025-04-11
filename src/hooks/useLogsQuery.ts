import { useQuery } from "@tanstack/react-query";

export const useLogsQuery = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: () =>
      fetch(`/api/v1/logs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    refetchOnWindowFocus: "always",
    refetchOnMount: true,
    refetchOnReconnect: "always",
    refetchInterval: 1000,
    staleTime: 1000 * 60 * 5,
  });
};
