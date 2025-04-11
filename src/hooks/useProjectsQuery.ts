import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/getProjects";

export const useProjectsQuery = (authentiactedUserId: string | undefined) => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(authentiactedUserId),
  });
};
