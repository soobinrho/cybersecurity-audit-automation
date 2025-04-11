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

  // if (!evidence_what_for) {
  //   const results = await prisma.evidence_images.findMany({
  //     where: {
  //       caa_user_id: userAuthenticatedID,
  //     },
  //   });
  //   return results;
  // } else if (evidence_what_for.toLowerCase() === "mfa") {
  //   const results = await prisma.evidence_images.findMany({
  //     where: {
  //       caa_user_id: userAuthenticatedID,
  //       evidence_what_for: evidence_what_for,
  //       org_id_fk: org_id_fk,
  //     },
  //     orderBy: {
  //       evidence_image_id: "desc",
  //     },
  //     take: 1,
  //   });
  //   return results;
  // } else if (evidence_what_for.toLowerCase() === "pitr") {
  //   const results = await prisma.evidence_images.findMany({
  //     where: {
  //       caa_user_id: userAuthenticatedID,
  //       evidence_what_for: evidence_what_for,
  //       project_id_fk: project_id_fk,
  //     },
  //     orderBy: {
  //       evidence_image_id: "desc",
  //     },
  //     take: 1,
  //   });
  //   return results;
  // } else if (evidence_what_for.toLowerCase() === "rls") {
  //   const results = await prisma.evidence_images.findMany({
  //     where: {
  //       caa_user_id: userAuthenticatedID,
  //       evidence_what_for: evidence_what_for,
  //       project_id_fk: project_id_fk,
  //     },
  //     orderBy: {
  //       evidence_image_id: "desc",
  //     },
  //     take: 1,
  //   });
  //   return results;
  // } else {
  //   return [];
  // }
}
