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
    const logs = await prisma.logs.findMany({
      where: {
        caa_user_id: userAuthenticatedID,
      },
    });
    return NextResponse.json(logs, {
      status: 200,
      statusText: "OK",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

export async function POST(req: NextRequest) {
  let log: Prisma.logsCreateInput;
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
    const org_id = req_payload["org_id"];
    const user_email = req_payload["user_email"];
    const project_id = req_payload["project_id"];
    const table_project_id = req_payload["table_project_id"];
    const table_name = req_payload["table_name"];
    log = {
      caa_user_id: userAuthenticatedID,
      PRI_FACILITY: req_payload["PRI_FACILITY"],
      PRI_SEVERITY: req_payload["PRI_SEVERITY"],
      VER: req_payload["VER"],
      TIMESTAMP: req_payload["TIMESTAMP"],
      HOSTNAME: req_payload["HOSTNAME"],
      APPNAME: req_payload["APPNAME"],
      PROCID: req_payload["PROCID"],
      MSG: req_payload["MSG"],
    };
    if (org_id && org_id !== "") {
      log.organizations = {
        connectOrCreate: {
          where: {
            org_id: org_id,
          },
          create: {
            org_id: org_id,
            org_name:
              "POST request to the logs table generated this record because there was no pre-existing record for this org_id.",
            caa_user_id: userAuthenticatedID,
            org_last_updated_on_caa: Math.floor(new Date().getTime() / 1000),
          },
        },
      };
    }
    if (user_email && user_email !== "") {
      log.users = {
        connectOrCreate: {
          where: {
            user_email: user_email,
          },
          create: {
            user_email: user_email,
            caa_user_id: userAuthenticatedID,
            user_is_mfa_enabled: 0,
            user_last_updated_on_caa: Math.floor(new Date().getTime() / 1000),
          },
        },
      };
    }
    if (project_id && project_id !== "") {
      log.projects = {
        connectOrCreate: {
          where: {
            project_id: project_id,
          },
          create: {
            project_id: project_id,
            caa_user_id: userAuthenticatedID,
            project_is_pitr_enabled: 0,
            project_name: "",
            project_last_updated_on_caa: Math.floor(
              new Date().getTime() / 1000
            ),
          },
        },
      };
    }
    if (
      table_project_id &&
      table_project_id !== "" &&
      table_name &&
      table_name !== ""
    ) {
      log.tables = {
        connectOrCreate: {
          where: {
            project_id_fk_table_name: {
              project_id_fk: table_project_id,
              table_name: table_name,
            },
          },
          create: {
            project_id_fk: table_project_id,
            table_name: table_name,
            caa_user_id: userAuthenticatedID,
            table_is_rls_enabled: 0,
            table_last_updated_on_caa: Math.floor(
              new Date().getTime() / 1000
            ),
          },
        },
      };
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    const createLog = await prisma.logs.create({
      data: log,
    });

    if (process.env.NODE_ENV === "development") {
      console.log(createLog);
    }

    return NextResponse.json(createLog, { status: 201, statusText: "Created" });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
