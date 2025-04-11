import prisma from "@/lib/prisma";

export async function getEvidenceImageBlob(
  userAuthenticatedID: string | undefined,
  evidence_image_id: number
) {
  try {
    const results = await prisma.evidence_images.findUnique({
      where: {
        caa_user_id: userAuthenticatedID,
        evidence_image_id: evidence_image_id,
      },
      select: {
        caa_user_id: true,
        evidence_image_id: true,
        org_id_fk: false,
        user_email_fk: false,
        project_id_fk: false,
        table_name_fk: false,
        evidence_what_for: false,
        evidence_image_name: false,
        evidence_image_size: false,
        evidence_image_blob: true,
        evidence_image_last_updated_on_caa: false,
      },
    });
    return results;
  } catch {
    return null;
  }
}
