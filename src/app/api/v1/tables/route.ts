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
    const results = await prisma.tables.findMany({
      where: {
        caa_user_id: userAuthenticatedID,
      },
    });
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
    return NextResponse.json("Error occurred.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

export async function POST(req: NextRequest) {
  const array_table: Array<Prisma.tablesCreateInput> = [];
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
      const table: Prisma.tablesCreateInput = {
        projects: json_req["project_id_fk"],
        caa_user_id: userAuthenticatedID,
        table_name: json_req["table_name"],
        table_is_rls_enabled: json_req["table_is_rls_enabled"],
        table_last_updated_on_caa: json_req["table_last_updated_on_caa"],
      };
      array_table.push(table);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    const array_upsertTables = [];
    for (const table of array_table) {
      array_upsertTables.push(
        prisma.tables.upsert({
          where: {
            project_id_fk_table_name: {
              project_id_fk: String(table["projects"]),
              table_name: String(table["table_name"]),
            },
            caa_user_id: userAuthenticatedID,
          },
          update: {
            table_is_rls_enabled: table["table_is_rls_enabled"],
            table_last_updated_on_caa: table["table_last_updated_on_caa"],
          },
          create: {
            project_id_fk: String(table["projects"]),
            caa_user_id: userAuthenticatedID,
            table_name: table["table_name"],
            table_is_rls_enabled: table["table_is_rls_enabled"],
            table_last_updated_on_caa: table["table_last_updated_on_caa"],
          },
        })
      );
    }

    const transaction = await prisma.$transaction(array_upsertTables);

    if (process.env.NODE_ENV === "development") {
      console.log(transaction);
    }

    return NextResponse.json(array_table, {
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
        !project_id_fk ||
        project_id_fk === "" ||
        !table_name ||
        table_name === ""
      ) {
        return NextResponse.json(
          "Please use correct URL params to specify which organization_member you'd like to delete.",
          { status: 404, statusText: "Not Found" }
        );
      }

      const deleteTable = await prisma.tables.delete({
        where: {
          project_id_fk_table_name: {
            project_id_fk: project_id_fk,
            table_name: table_name,
          },
          caa_user_id: userAuthenticatedID,
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
      "Please use correct URL params to specify which organization_member you'd like to delete.",
      { status: 404, statusText: "Not Found" }
    );
  }
}
