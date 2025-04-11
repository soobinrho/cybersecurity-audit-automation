import { useQuery } from "@tanstack/react-query";

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch(`/api/v1/users`, {
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
