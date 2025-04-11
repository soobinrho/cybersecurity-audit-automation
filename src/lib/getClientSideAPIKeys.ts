import prisma from "@/lib/prisma";

export async function getClientSideAPIKeys(
  userAuthenticatedID: string | undefined
) {
  if (!userAuthenticatedID) {
    return null;
  }
  const results = await prisma.client_side_api_keys.findFirst({
    where: {
      caa_user_id: userAuthenticatedID,
    },
  });
  return results;
}
