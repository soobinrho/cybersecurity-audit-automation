import prisma from "@/lib/prisma";

export async function getEvidenceImagesMetadata(
  userAuthenticatedID: string | undefined
) {
  if (!userAuthenticatedID) {
    return null;
  }
  try {
    const results = await prisma.evidence_images.findMany({
      where: {
        caa_user_id: userAuthenticatedID,
      },
      select: {
        caa_user_id: true,
        evidence_image_id: true,
        org_id_fk: true,
        user_email_fk: true,
        project_id_fk: true,
        table_name_fk: true,
        evidence_what_for: true,
        evidence_image_name: true,
        evidence_image_size: true,
        evidence_image_blob: false,
        evidence_image_last_updated_on_caa: true,
      },
    });
    return results;
  } catch {
    return null;
  }
}
