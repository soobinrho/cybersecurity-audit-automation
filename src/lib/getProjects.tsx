import prisma from "@/lib/prisma";

export async function getProjects(userAuthenticatedID: string | undefined) {
  if (!userAuthenticatedID) {
    return [];
  }
  const results = await prisma.projects.findMany({
    where: {
      caa_user_id: userAuthenticatedID,
    },
  });
  return results;
}
