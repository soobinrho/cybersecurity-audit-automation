import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/getUsers";

export const useUsersQuery = (authentiactedUserId: string | undefined) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(authentiactedUserId),
  });
};
