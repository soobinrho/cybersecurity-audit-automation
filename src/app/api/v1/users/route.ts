import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import checkAuthenticationForAPI from "@/lib/checkAuthenticationForAPI";
import { auth } from "@/auth";
import { getUsers } from "@/lib/getUsers";

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
    const results = await getUsers(userAuthenticatedID);
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

    const array_usersCreateInput = [];
    for (const json_req of req_payload) {
      const user_email = json_req["user_email"];
      const user_is_mfa_enabled = json_req["user_is_mfa_enabled"];
      const user_last_updated_on_caa = json_req["user_last_updated_on_caa"];
      if (
        typeof user_email !== "string" ||
        user_email === "" ||
        isNaN(parseInt(user_is_mfa_enabled)) ||
        (parseInt(user_is_mfa_enabled) !== 0 &&
          parseInt(user_is_mfa_enabled) !== 1) ||
        isNaN(parseInt(user_last_updated_on_caa))
      ) {
        return NextResponse.json(
          { message: "Missing required fields." },
          { status: 400, statusText: "Bad Request" }
        );
      }

      const usersCreateInput: Prisma.usersCreateInput = {
        caa_user_id: userAuthenticatedID,
        user_email: user_email,
        user_is_mfa_enabled: user_is_mfa_enabled,
        user_last_updated_on_caa: user_last_updated_on_caa,
      };
      array_usersCreateInput.push(usersCreateInput);
    }

    const array_upsertUsers = [];
    for (const user of array_usersCreateInput) {
      array_upsertUsers.push(
        prisma.users.upsert({
          where: {
            caa_user_id: userAuthenticatedID,
            user_email: user.user_email,
          },
          update: {
            user_is_mfa_enabled: user.user_is_mfa_enabled,
            user_last_updated_on_caa: user.user_last_updated_on_caa,
          },
          create: {
            caa_user_id: userAuthenticatedID,
            user_email: user.user_email,
            user_is_mfa_enabled: user.user_is_mfa_enabled,
            user_last_updated_on_caa: user.user_last_updated_on_caa,
          },
        })
      );
    }

    const transaction = await prisma.$transaction(array_upsertUsers);

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
      if (typeof user_email !== "string" || user_email === "") {
        return NextResponse.json(
          {
            message: "Please use correct URL params.",
          },
          { status: 404, statusText: "Not Found" }
        );
      }

      const deleteUser = await prisma.users.delete({
        where: {
          caa_user_id: userAuthenticatedID,
          user_email: user_email,
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
