import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getClientSideAPIKeys } from "@/lib/getClientSideAPIKeys";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    // Check authentication.
    const oAuthSession = await auth();
    if (!oAuthSession) {
      return NextResponse.json(
        {
          message: "Authentication failed.",
        },
        { status: 401, statusText: "Unauthorized" }
      );
    }

    // Proceed if authenticated.
    let userAuthenticatedID;
    if (oAuthSession.user) userAuthenticatedID = oAuthSession.user.id;
    const results = await getClientSideAPIKeys(userAuthenticatedID);
    if (results) {
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

export async function DELETE() {
  try {
    // Check authentication.
    const oAuthSession = await auth();
    if (!oAuthSession) {
      return NextResponse.json(
        {
          message: "Authentication failed.",
        },
        { status: 401, statusText: "Unauthorized" }
      );
    }

    // Proceed if authenticated.
    let userAuthenticatedID;
    if (oAuthSession.user) userAuthenticatedID = oAuthSession.user.id;
    await prisma.client_side_api_keys.deleteMany({
      where: {
        caa_user_id: userAuthenticatedID,
      },
    });

    // By convention, HTTP 204 code must not contain any body, and must
    // only contain the status code.
    return new Response(null, {
      status: 204,
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
