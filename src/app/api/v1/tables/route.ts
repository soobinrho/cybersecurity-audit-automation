import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import checkAuthenticationForAPI from "@/lib/checkAuthenticationForAPI";
import { auth } from "@/auth";
import { getTables } from "@/lib/getTables";

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
    const results = await getTables(userAuthenticatedID);
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

    const array_tablesCreateInput = [];
    for (const json_req of req_payload) {
      const project_id_fk = json_req["project_id_fk"];
      const table_name = json_req["table_name"];
      const table_is_rls_enabled = json_req["table_is_rls_enabled"];
      const table_last_updated_on_caa =
        json_req["table_last_updated_on_caa"];
      if (
        typeof project_id_fk !== "string" ||
        project_id_fk === "" ||
        typeof table_name !== "string" ||
        table_name === "" ||
        isNaN(parseInt(table_is_rls_enabled)) ||
        (parseInt(table_is_rls_enabled) !== 0 &&
          parseInt(table_is_rls_enabled) !== 1) ||
        isNaN(parseInt(table_last_updated_on_caa))
      ) {
        return NextResponse.json(
          { message: "Missing required fields." },
          { status: 400, statusText: "Bad Request" }
        );
      }

      const tablesCreateInput: Prisma.tablesCreateInput = {
        caa_user_id: userAuthenticatedID,
        projects: {
          connect: { project_id: project_id_fk },
        },
        table_name: table_name,
        table_is_rls_enabled: table_is_rls_enabled,
        table_last_updated_on_caa: table_last_updated_on_caa,
      };
      array_tablesCreateInput.push(tablesCreateInput);
    }

    const array_upsertTables = [];
    for (const tablesCreateInput of array_tablesCreateInput) {
      const projectConnect = tablesCreateInput.projects as {
        connect: { project_id: string };
      };

      array_upsertTables.push(
        prisma.tables.upsert({
          where: {
            caa_user_id: userAuthenticatedID,
            project_id_fk_table_name: {
              project_id_fk: projectConnect.connect.project_id,
              table_name: tablesCreateInput.table_name,
            },
          },
          update: {
            table_is_rls_enabled: tablesCreateInput.table_is_rls_enabled,
            table_last_updated_on_caa:
              tablesCreateInput.table_last_updated_on_caa,
          },
          create: {
            caa_user_id: userAuthenticatedID,
            project_id_fk: projectConnect.connect.project_id,
            table_name: tablesCreateInput.table_name,
            table_is_rls_enabled: tablesCreateInput.table_is_rls_enabled,
            table_last_updated_on_caa:
              tablesCreateInput.table_last_updated_on_caa,
          },
        })
      );
    }

    const transaction = await prisma.$transaction(array_upsertTables);

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
      const deleteTables = await prisma.tables.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteTables);
      }

      // By convention, HTTP 204 code must not contain any body, and must
      // only contain the status code.
      return new Response(null, {
        status: 204,
      });
    } else {
      const project_id_fk = params.get("project_id_fk");
      const table_name = params.get("table_name");
      if (
        typeof project_id_fk !== "string" ||
        project_id_fk === "" ||
        typeof table_name !== "string" ||
        table_name === ""
      ) {
        return NextResponse.json(
          {
            message: "Please use correct URL params.",
          },
          { status: 404, statusText: "Not Found" }
        );
      }

      const deleteTable = await prisma.tables.delete({
        where: {
          caa_user_id: userAuthenticatedID,
          project_id_fk_table_name: {
            project_id_fk: project_id_fk,
            table_name: table_name,
          },
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteTable);
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
