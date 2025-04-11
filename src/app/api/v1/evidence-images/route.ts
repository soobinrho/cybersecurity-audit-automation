import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import checkAuthenticationForAPI from "@/lib/checkAuthenticationForAPI";
import { getEvidenceImages } from "@/lib/getEvidenceImages";

export async function GET(req: NextRequest) {
  try {
    // Check authentication.
    const oAuthSession = await auth();
    const clientSideAuthForAPI = req.headers.get("authorization") as string;
    const authResults = await checkAuthenticationForAPI(
      oAuthSession,
      clientSideAuthForAPI
    );
    if (!authResults) {
      return NextResponse.json(
        {
          message: "Authentication failed.",
        },
        { status: 401, statusText: "Unauthorized" }
      );
    }

    // Proceed if authenticated.
    const userAuthenticatedID = authResults.userAuthenticatedID;
    const results = await getEvidenceImages(userAuthenticatedID);
    if (results.length > 0) {
      return NextResponse.json(results, {
        status: 200,
        statusText: "OK",
      });
    } else {
      return new Response(null, {
        status: 204,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Error occurred.",
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication.
    const oAuthSession = await auth();
    const clientSideAuthForAPI = req.headers.get("authorization") as string;
    const authResults = await checkAuthenticationForAPI(
      oAuthSession,
      clientSideAuthForAPI
    );
    if (!authResults) {
      return NextResponse.json(
        {
          message: "Authentication failed.",
        },
        { status: 401, statusText: "Unauthorized" }
      );
    }

    // Proceed if authenticated.
    const userAuthenticatedID = authResults.userAuthenticatedID;
    const req_payload = await req.json();
    if (!Array.isArray(req_payload)) {
      return NextResponse.json(
        {
          message:
            'The request payload must be an array. It can even be an array with only one member such as "[{...}]"',
        },
        { status: 400, statusText: "Bad Request" }
      );
    }

    const array_evidenceImagesCreateInput = [];
    for (const json_req of req_payload) {
      const evidence_what_for = json_req["evidence_what_for"];
      const evidence_image_name = json_req["evidence_image_name"];
      const evidence_image_size = json_req["evidence_image_size"];
      const evidence_image_blob = json_req["evidence_image_blob"];
      const evidence_image_last_updated_on_caa =
        json_req["evidence_image_last_updated_on_caa"];
      if (
        typeof evidence_what_for !== "string" ||
        evidence_what_for === "" ||
        typeof evidence_image_name !== "string" ||
        evidence_image_name === "" ||
        isNaN(parseInt(evidence_image_size)) ||
        typeof evidence_image_blob !== "string" ||
        evidence_image_blob === "" ||
        isNaN(parseInt(evidence_image_last_updated_on_caa))
      ) {
        return NextResponse.json(
          { message: "Missing required fields." },
          { status: 400, statusText: "Bad Request" }
        );
      }
      const evidenceImagesCreateInput: Prisma.evidence_imagesCreateInput = {
        caa_user_id: userAuthenticatedID,
        evidence_what_for: evidence_what_for,
        evidence_image_name: evidence_image_name,
        evidence_image_size: evidence_image_size,
        evidence_image_blob: Buffer.from(evidence_image_blob, "base64"),
        evidence_image_last_updated_on_caa:
          evidence_image_last_updated_on_caa,
      };
      const org_id_fk = json_req["org_id"];
      const user_email_fk = json_req["user_email"];
      const project_id_fk = json_req["project_id"];
      const table_name_fk = json_req["table_name"];
      if (typeof org_id_fk === "string" && org_id_fk !== "") {
        evidenceImagesCreateInput.organizations = {
          connectOrCreate: {
            where: { org_id: org_id_fk },
            create: {
              caa_user_id: userAuthenticatedID,
              org_id: org_id_fk,
              org_name: "",
              org_last_updated_on_caa: Math.floor(Date.now() / 1000),
            },
          },
        };
      }
      if (typeof user_email_fk === "string" && user_email_fk !== "") {
        evidenceImagesCreateInput.users = {
          connectOrCreate: {
            where: { user_email: user_email_fk },
            create: {
              caa_user_id: userAuthenticatedID,
              user_email: user_email_fk,
              user_is_mfa_enabled: 0,
              user_last_updated_on_caa: Math.floor(Date.now() / 1000),
            },
          },
        };
      }
      if (typeof project_id_fk === "string" && project_id_fk !== "") {
        evidenceImagesCreateInput.projects = {
          connectOrCreate: {
            where: { project_id: project_id_fk },
            create: {
              caa_user_id: userAuthenticatedID,
              project_id: project_id_fk,
              project_name: "",
              project_is_pitr_enabled: 0,
              project_last_updated_on_caa: Math.floor(Date.now() / 1000),
            },
          },
        };
      }
      if (typeof table_name_fk === "string" && table_name_fk !== "") {
        evidenceImagesCreateInput.table_name_fk = table_name_fk;
      }
      array_evidenceImagesCreateInput.push(evidenceImagesCreateInput);
    }

    const array_createEvidenceImages = [];
    for (const evidenceImage of array_evidenceImagesCreateInput) {
      const createEvidenceImage = prisma.evidence_images.create({
        data: evidenceImage,
      });
      array_createEvidenceImages.push(createEvidenceImage);
    }

    const transaction = await prisma.$transaction(array_createEvidenceImages);

    if (process.env.NODE_ENV === "development") {
      console.log(transaction);
    }

    return NextResponse.json(array_createEvidenceImages, {
      status: 201,
      statusText: "Created",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Error occurred.",
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication.
    const oAuthSession = await auth();
    const clientSideAuthForAPI = req.headers.get("authorization") as string;
    const authResults = await checkAuthenticationForAPI(
      oAuthSession,
      clientSideAuthForAPI
    );
    if (!authResults) {
      return NextResponse.json(
        {
          message: "Authentication failed.",
        },
        { status: 401, statusText: "Unauthorized" }
      );
    }

    // Proceed if authenticated.
    const userAuthenticatedID = authResults.userAuthenticatedID;
    const params = req.nextUrl.searchParams;
    const delete_all = params.get("delete_all")?.toLowerCase();
    if (delete_all === "true") {
      const deleteEvidenceImages = await prisma.evidence_images.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteEvidenceImages);
      }

      // By convention, HTTP 204 code must not contain any body, and must
      // only contain the status code.
      return new Response(null, {
        status: 204,
      });
    } else {
      const evidence_image_id = params.get("evidence_image_id");
      if (
        typeof evidence_image_id !== "string" ||
        evidence_image_id === "" ||
        isNaN(parseInt(evidence_image_id))
      ) {
        return NextResponse.json(
          {
            message: "Please use correct URL params.",
          },
          {
            status: 404,
            statusText: "Not Found",
          }
        );
      }

      const deleteEvidenceImage = await prisma.evidence_images.delete({
        where: {
          caa_user_id: userAuthenticatedID,
          evidence_image_id: parseInt(evidence_image_id),
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteEvidenceImage);
      }

      return new Response(null, {
        status: 204,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Error occurred.",
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}
