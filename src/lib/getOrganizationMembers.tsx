import prisma from "@/lib/prisma";

export async function getOrganizationMembers(
  userAuthenticatedID: string | undefined
) {
  if (!userAuthenticatedID) {
    return [];
  }
  const results = await prisma.organization_members.findMany({
    where: {
      caa_user_id: userAuthenticatedID,
    },
  });
  return results;
}
