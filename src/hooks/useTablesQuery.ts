import { useQuery } from "@tanstack/react-query";

export const useTablesQuery = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: () =>
      fetch(`/api/v1/tables`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 1000,
  });
};
