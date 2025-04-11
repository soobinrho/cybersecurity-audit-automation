import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import checkAuthenticationForAPI from "@/lib/checkAuthenticationForAPI";
import { getOrganizationMembers } from "@/lib/getOrganizationMembers";

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
    const results = await getOrganizationMembers(userAuthenticatedID);
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
            "The request payload must be an array. It can even be an array with only one member such as '[{...}]'",
        },
        { status: 400, statusText: "Bad Request" }
      );
    }

    const array_organizationMembersCreateInput = [];
    for (const json_req of req_payload) {
      const org_id_fk = json_req["org_id_fk"];
      const user_email_fk = json_req["user_email_fk"];
      const org_member_role = json_req["org_member_role"];
      if (
        typeof org_id_fk !== "string" ||
        org_id_fk === "" ||
        typeof user_email_fk !== "string" ||
        user_email_fk === "" ||
        typeof org_member_role !== "string" ||
        org_member_role === ""
      ) {
        return NextResponse.json(
          { message: "Missing required fields." },
          { status: 400, statusText: "Bad Request" }
        );
      }

      const organizationMembersCreateInput: Prisma.organization_membersCreateInput =
        {
          caa_user_id: userAuthenticatedID,
          organizations: {
            connect: { org_id: org_id_fk },
          },
          users: {
            connect: { user_email: user_email_fk },
          },
          org_member_role: org_member_role,
        };
      array_organizationMembersCreateInput.push(organizationMembersCreateInput);
    }

    const array_upsertOrganizationMembers = [];
    for (const organizationMember of array_organizationMembersCreateInput) {
      const orgConnect = organizationMember.organizations as {
        connect: { org_id: string };
      };
      const userConnect = organizationMember.users as {
        connect: { user_email: string };
      };

      array_upsertOrganizationMembers.push(
        prisma.organization_members.upsert({
          where: {
            caa_user_id: userAuthenticatedID,
            org_id_fk_user_email_fk: {
              org_id_fk: orgConnect.connect.org_id,
              user_email_fk: userConnect.connect.user_email,
            },
          },
          update: {
            org_member_role: organizationMember.org_member_role,
          },
          create: {
            caa_user_id: userAuthenticatedID,
            organizations: {
              connectOrCreate: {
                where: { org_id: orgConnect.connect.org_id },
                create: {
                  caa_user_id: userAuthenticatedID,
                  org_id: orgConnect.connect.org_id,
                  org_name: "",
                  org_last_updated_on_caa: 0,
                },
              },
            },
            users: {
              connectOrCreate: {
                where: { user_email: userConnect.connect.user_email },
                create: {
                  caa_user_id: userAuthenticatedID,
                  user_email: userConnect.connect.user_email,
                  user_is_mfa_enabled: 0,
                  user_last_updated_on_caa: 0,
                },
              },
            },
            org_member_role: organizationMember.org_member_role,
          },
        })
      );
    }

    const transaction = await prisma.$transaction(
      array_upsertOrganizationMembers
    );

    if (process.env.NODE_ENV === "development") {
      console.log(transaction);
    }

    return NextResponse.json(transaction, {
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
        status: 500,
        statusText: "Internal Server Error",
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
      const deleteOrganizationMembers =
        await prisma.organization_members.deleteMany({
          where: {
            caa_user_id: userAuthenticatedID,
          },
        });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteOrganizationMembers);
      }

      // By convention, HTTP 204 code must not contain any body, and must
      // only contain the status code.
      return new Response(null, {
        status: 204,
      });
    } else {
      const org_id_fk = params.get("org_id_fk");
      const user_email_fk = params.get("user_email_fk");
      if (
        typeof org_id_fk !== "string" ||
        org_id_fk === "" ||
        typeof user_email_fk !== "string" ||
        user_email_fk === ""
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

      const deleteOrganizationMember = await prisma.organization_members.delete(
        {
          where: {
            caa_user_id: userAuthenticatedID,
            org_id_fk_user_email_fk: {
              org_id_fk: org_id_fk,
              user_email_fk: user_email_fk,
            },
          },
        }
      );

      if (process.env.NODE_ENV === "development") {
        console.log(deleteOrganizationMember);
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
