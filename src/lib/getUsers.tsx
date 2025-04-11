import prisma from "@/lib/prisma";

export async function getUsers(userAuthenticatedID: string | undefined) {
  if (!userAuthenticatedID) {
    return [];
  }
  const results = await prisma.users.findMany({
    where: {
      caa_user_id: userAuthenticatedID,
    },
  });
  return results;
}
