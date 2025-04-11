import prisma from "@/lib/prisma";

export async function getTables(userAuthenticatedID: string | undefined) {
  if (!userAuthenticatedID) {
    return [];
  }
  const results = await prisma.tables.findMany({
    where: {
      caa_user_id: userAuthenticatedID,
    },
  });
  return results;
}
