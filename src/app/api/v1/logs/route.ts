import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import checkAuthenticationForAPI from "@/lib/checkAuthenticationForAPI";
import { getLogs } from "@/lib/getLogs";

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
    const results = await getLogs(userAuthenticatedID);
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
    const clientSideApiKeyID = authResults.clientSideApiKeyID;
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

    const array_logsCreateInput = [];
    for (const json_req of req_payload) {
      const PRI_FACILITY = json_req["PRI_FACILITY"];
      const PRI_SEVERITY = json_req["PRI_SEVERITY"];
      const VER = json_req["VER"];
      const TIMESTAMP = json_req["TIMESTAMP"];
      const HOSTNAME = json_req["HOSTNAME"];
      const APPNAME = json_req["APPNAME"];
      const PROCID = json_req["PROCID"];
      const MSG = json_req["MSG"];
      if (
        isNaN(parseInt(PRI_FACILITY)) ||
        isNaN(parseInt(PRI_SEVERITY)) ||
        isNaN(parseInt(VER)) ||
        typeof TIMESTAMP !== "string" ||
        TIMESTAMP === "" ||
        typeof HOSTNAME !== "string" ||
        HOSTNAME === "" ||
        typeof APPNAME !== "string" ||
        APPNAME === "" ||
        typeof PROCID !== "string" ||
        PROCID === "" ||
        typeof MSG !== "string" ||
        MSG === ""
      ) {
        return NextResponse.json(
          { message: "Missing required fields." },
          { status: 400, statusText: "Bad Request" }
        );
      }
      const logsCreateInput: Prisma.logsCreateInput = {
        caa_user_id: userAuthenticatedID,
        client_side_api_key_id_fk: clientSideApiKeyID,
        PRI_FACILITY: PRI_FACILITY,
        PRI_SEVERITY: PRI_SEVERITY,
        VER: VER,
        TIMESTAMP: TIMESTAMP,
        HOSTNAME: HOSTNAME,
        APPNAME: APPNAME,
        PROCID: PROCID,
        MSG: MSG,
      };
      const org_id_fk = json_req["org_id"];
      const user_email_fk = json_req["user_email"];
      const project_id_fk = json_req["project_id"];
      const table_name_fk = json_req["table_name"];
      const evidence_image_id_fk = json_req["evidence_image_id"];
      if (typeof org_id_fk === "string" && org_id_fk !== "") {
        logsCreateInput.org_id_fk = org_id_fk;
      }
      if (typeof user_email_fk === "string" && user_email_fk !== "") {
        logsCreateInput.user_email_fk = user_email_fk;
      }
      if (typeof project_id_fk === "string" && project_id_fk !== "") {
        logsCreateInput.project_id_fk = project_id_fk;
      }
      if (typeof table_name_fk === "string" && table_name_fk !== "") {
        logsCreateInput.table_name_fk = table_name_fk;
      }
      if (
        typeof evidence_image_id_fk === "string" &&
        evidence_image_id_fk !== ""
      ) {
        logsCreateInput.evidence_image_id_fk = evidence_image_id_fk;
      }
      array_logsCreateInput.push(logsCreateInput);
    }

    const array_createLogs = [];
    for (const log of array_logsCreateInput) {
      const createLog = prisma.logs.create({
        data: log,
      });
      array_createLogs.push(createLog);
    }

    const transaction = await prisma.$transaction(array_createLogs);

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
