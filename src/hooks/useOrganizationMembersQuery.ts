import { useQuery } from "@tanstack/react-query";

export const useOrganizationMembersQuery = () => {
  return useQuery({
    queryKey: ["organization_members"],
    queryFn: () =>
      fetch(`/api/v1/organization-members`, {
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
