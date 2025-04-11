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
    const userAuthenticatedID = await checkAuthenticationForAPI(
      oAuthSession,
      clientSideAuthForAPI
    );
    if (!userAuthenticatedID || userAuthenticatedID === "") {
      return NextResponse.json(
        {
          message: "Authentication failed.",
        },
        { status: 401, statusText: "Unauthorized" }
      );
    }

    // Proceed if authenticated.
    const users = await prisma.users.findMany({
      where: {
        caa_user_id: userAuthenticatedID,
      },
    });
    return NextResponse.json(users, { status: 200, statusText: "OK" });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

export async function POST(req: NextRequest) {
  const array_user: Array<Prisma.usersCreateInput> = [];
  let userAuthenticatedID = "";
  try {
    // Check authentication.
    const oAuthSession = await auth();
    const clientSideAuthForAPI = req.headers.get("authorization");
    userAuthenticatedID = await checkAuthenticationForAPI(
      oAuthSession,
      clientSideAuthForAPI
    );
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
      const user: Prisma.usersCreateInput = {
        user_email: json_req["user_email"],
        caa_user_id: userAuthenticatedID,
        user_is_mfa_enabled: json_req["user_is_mfa_enabled"],
        user_last_updated_on_caa: json_req["user_last_updated_on_caa"],
      };
      array_user.push(user);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    let array_upsertUsers = [];
    for (const user of array_user) {
      array_upsertUsers.push(
        prisma.users.upsert({
          where: {
            user_email: user["user_email"],
          },
          update: {
            user_is_mfa_enabled: user["user_is_mfa_enabled"],
            user_last_updated_on_caa: user["user_last_updated_on_caa"],
          },
          create: {
            user_email: user["user_email"],
            caa_user_id: userAuthenticatedID,
            user_is_mfa_enabled: user["user_is_mfa_enabled"],
            user_last_updated_on_caa: user["user_last_updated_on_caa"],
          },
        })
      );
    }

    const transaction = await prisma.$transaction(array_upsertUsers);

    if (process.env.NODE_ENV === "development") {
      console.log(transaction);
    }

    return NextResponse.json(array_user, {
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
  let userAuthenticatedID = "";
  try {
    // Check authentication.
    const oAuthSession = await auth();
    const clientSideAuthForAPI = req.headers.get("authorization");
    userAuthenticatedID = await checkAuthenticationForAPI(
      oAuthSession,
      clientSideAuthForAPI
    );
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
      const deleteUsers = await prisma.users.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteUsers);
      }

      // By convention, HTTP 204 code must not contain any body, and must
      // only contain the status code.
      return new Response(null, {
        status: 204,
      });
    } else {
      const user_email = params.get("user_email");
      if (!user_email || user_email === "") {
        return NextResponse.json(
          "Please use correct URL params to specify which organization_member you'd like to delete.",
          { status: 404, statusText: "Not Found" }
        );
      }

      const deleteUser = await prisma.users.delete({
        where: {
          user_email: user_email,
          caa_user_id: userAuthenticatedID,
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteUser);
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
