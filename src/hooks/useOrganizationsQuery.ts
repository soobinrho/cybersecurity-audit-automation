import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "@/lib/getOrganizations";

export const useOrganizationsQuery = (
  authentiactedUserId: string | undefined
) => {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations(authentiactedUserId),
  });
};
