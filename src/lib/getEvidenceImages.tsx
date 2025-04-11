import prisma from "@/lib/prisma";

export async function getEvidenceImages(
  userAuthenticatedID: string | undefined
) {
  if (!userAuthenticatedID) {
    return [];
  }
  const results = await prisma.evidence_images.findMany({
    where: {
      caa_user_id: userAuthenticatedID,
    },
  });
  return results;
}
