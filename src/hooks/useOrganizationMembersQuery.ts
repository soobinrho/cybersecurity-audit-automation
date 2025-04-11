import { useQuery } from "@tanstack/react-query";
import { getOrganizationMembers } from "@/lib/getOrganizationMembers";

export const useOrganizationMembersQuery = (
  authentiactedUserId: string | undefined
) => {
  return useQuery({
    queryKey: ["organization_members"],
    queryFn: () => getOrganizationMembers(authentiactedUserId),
  });
};
