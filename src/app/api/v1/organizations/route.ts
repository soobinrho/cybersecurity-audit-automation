import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import checkAuthenticationForAPI from "@/lib/checkAuthenticationForAPI";
import { auth } from "@/auth";
import { getOrganizations } from "@/lib/getOrganizations";

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
    const results = await getOrganizations(userAuthenticatedID);
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

    const array_organizationsCreateInput = [];
    for (const json_req of req_payload) {
      const org_id = json_req["org_id"];
      const org_name = json_req["org_name"];
      const org_last_updated_on_caa = json_req["org_last_updated_on_caa"];

      if (
        typeof org_id !== "string" ||
        org_id === "" ||
        typeof org_name !== "string" ||
        org_name === "" ||
        isNaN(parseInt(org_last_updated_on_caa))
      ) {
        return NextResponse.json(
          { message: "Missing required fields." },
          { status: 400, statusText: "Bad Request" }
        );
      }
      const organizationsCreateInput: Prisma.organizationsCreateInput = {
        caa_user_id: userAuthenticatedID,
        org_id: org_id,
        org_name: org_name,
        org_last_updated_on_caa: org_last_updated_on_caa,
      };
      array_organizationsCreateInput.push(organizationsCreateInput);
    }

    const array_upsertOrganizations = [];
    for (const organization of array_organizationsCreateInput) {
      array_upsertOrganizations.push(
        prisma.organizations.upsert({
          where: {
            caa_user_id: userAuthenticatedID,
            org_id: organization.org_id,
          },
          update: {
            org_name: organization.org_name,
            org_last_updated_on_caa: organization.org_last_updated_on_caa,
          },
          create: {
            caa_user_id: userAuthenticatedID,
            org_id: organization.org_id,
            org_name: organization.org_name,
            org_last_updated_on_caa: organization.org_last_updated_on_caa,
          },
        })
      );
    }
    const transaction = await prisma.$transaction(array_upsertOrganizations);

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
  const params = req.nextUrl.searchParams;
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
    const delete_all = params.get("delete_all")?.toLowerCase();
    if (delete_all === "true") {
      const deleteOrganizations = await prisma.organizations.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteOrganizations);
      }

      // By convention, HTTP 204 code must not contain any body, and must
      // only contain the status code.
      return new Response(null, {
        status: 204,
      });
    } else {
      const org_id = params.get("org_id");
      if (typeof org_id !== "string" || org_id === "") {
        return NextResponse.json("Please use correct URL params.", {
          status: 404,
          statusText: "Not Found",
        });
      }

      const deleteOrganization = await prisma.organizations.delete({
        where: {
          caa_user_id: userAuthenticatedID,
          org_id: org_id,
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
