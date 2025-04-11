import prisma from "@/lib/prisma";

export async function getLogs(userAuthenticatedID: string | undefined) {
  if (!userAuthenticatedID) {
    return [];
  }
  const results = await prisma.logs.findMany({
    where: {
      caa_user_id: userAuthenticatedID,
    },
  });
  return results;
}
