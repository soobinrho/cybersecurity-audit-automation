import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import checkAuthenticationForAPI from "@/lib/checkAuthenticationForAPI";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    // Check authentication.
    const oAuthSession = await auth();
    const clientSideAuthForAPI = req.headers.get("authorization");
    const userAuthenticatedID = await checkAuthenticationForAPI(oAuthSession, clientSideAuthForAPI);
    if (!userAuthenticatedID || userAuthenticatedID === '') {
      return NextResponse.json(
        {
          message: "Authentication failed.",
        },
        { status: 401, statusText: "Unauthorized" }
      );
    }

    // Proceed if authenticated.
    const organizations = await prisma.organizations.findMany({
      where: {
        caa_user_id: userAuthenticatedID,
      }
    });
    return NextResponse.json(organizations, { status: 200, statusText: "OK" });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

export async function POST(req: NextRequest) {
  const array_organization: Array<Prisma.organizationsCreateInput> = [];
  let userAuthenticatedID = '';
  try {
    // Check authentication.
    const oAuthSession = await auth();
    const clientSideAuthForAPI = req.headers.get("authorization");
    userAuthenticatedID = await checkAuthenticationForAPI(oAuthSession, clientSideAuthForAPI);
    if (!userAuthenticatedID) {
      return NextResponse.json(
        {
          message: "Authentication failed.",
        },
        { status: 401, statusText: "Unauthorized" }
      );
    }
 
    // Proceed if authenticated.
    const req_payload = await req.json();
    for (const json_req of req_payload) {
      const organization: Prisma.organizationsCreateInput = {
        org_id: json_req["org_id"],
        caa_user_id: userAuthenticatedID,
        org_name: json_req["org_name"],
        org_last_updated_on_caa: json_req["org_last_updated_on_caa"],
      };
      array_organization.push(organization);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    for (const organization of array_organization) {
      await prisma.organizations.upsert({
        where: {
          org_id: organization["org_id"],
        },
        update: {
          org_name: organization["org_name"],
          org_last_updated_on_caa: organization["org_last_updated_on_caa"],
        },
        create: {
          org_id: organization["org_id"],
          caa_user_id: userAuthenticatedID,
          org_name: organization["org_name"],
          org_last_updated_on_caa: organization["org_last_updated_on_caa"],
        },
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.log(array_organization);
    }

    return NextResponse.json(array_organization, {
      status: 201,
      statusText: "Created",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

export async function DELETE(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  let userAuthenticatedID = '';
  try {
    // Check authentication.
    const oAuthSession = await auth();
    const clientSideAuthForAPI = req.headers.get("authorization");
    userAuthenticatedID = await checkAuthenticationForAPI(oAuthSession, clientSideAuthForAPI);
    if (!userAuthenticatedID) {
      return NextResponse.json(
        {
          message: "Authentication failed.",
        },
        { status: 401, statusText: "Unauthorized" }
      );
    }
 
    // Proceed if authenticated.
    const delete_all = params.get("delete_all")?.toLowerCase();
    if (delete_all === "true") {
      const deleteTables = prisma.tables.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        }
      });
      const deleteProjects = prisma.projects.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        }
      });
      const deleteOrganizationMembers =
        prisma.organization_members.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        }
      });
      const deleteUsers = prisma.users.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        }
      });
      const deleteOrganizations = prisma.organizations.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        }
      });
      const transaction = await prisma.$transaction([
        deleteTables,
        deleteProjects,
        deleteOrganizationMembers,
        deleteUsers,
        deleteOrganizations,
      ]);

      if (process.env.NODE_ENV === "development") {
        console.log(transaction);
      }

      // By convention, HTTP 204 code must not contain any body, and must
      // only contain the status code.
      return new Response(null, {
        status: 204,
      });
    } else {
      const org_id = params.get("org_id");
      if (!org_id || org_id === "") {
        return NextResponse.json(
          "Please use correct URL params to specify which organization_member you'd like to delete.",
          { status: 404, statusText: "Not Found" }
        );
      }

      const deleteOrganization = await prisma.organizations.delete({
        where: {
          org_id: org_id,
          caa_user_id: userAuthenticatedID,
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteOrganization);
      }

      return new Response(null, {
        status: 204,
      });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      "Please use correct URL params to specify which organization_member you'd like to delete.",
      { status: 404, statusText: "Not Found" }
    );
  }
}
