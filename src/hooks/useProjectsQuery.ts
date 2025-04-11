import { useQuery } from "@tanstack/react-query";

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () =>
      fetch(`/api/v1/projects`, {
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
