import prisma from "@/lib/prisma";

export async function getOrganizations(
  userAuthenticatedID: string | undefined
) {
  if (!userAuthenticatedID) {
    return [];
  }
  const results = await prisma.organizations.findMany({
    where: {
      caa_user_id: userAuthenticatedID,
    },
  });
  return results;
}
