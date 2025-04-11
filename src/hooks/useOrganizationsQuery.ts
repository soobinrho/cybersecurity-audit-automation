import { useQuery } from "@tanstack/react-query";

export const useOrganizationsQuery = () => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      fetch(`/api/v1/organizations`, {
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
