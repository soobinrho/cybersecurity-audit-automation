import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const logs = await prisma.logs.findMany();
    return NextResponse.json(logs, { status: 200, statusText: "OK" });
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
  try {
    const req_payload = await req.json();
    log = {
      PRI: req_payload["PRI"],
      VER: req_payload["VER"],
      TIMESTAMP: req_payload["TIMESTAMP"],
      HOSTNAME: req_payload["HOSTNAME"],
      APPNAME: req_payload["APPNAME"],
      PROCID: req_payload["PROCID"],
      MSG: req_payload["MSG"],
    };
    const org_id = req_payload["org_id"];
    const user_email = req_payload["user_email"];
    const project_id = req_payload["project_id"];
    if (org_id && org_id !== "") {
      log.organizations = {
        connectOrCreate: {
          where: {
            org_id: org_id,
          },
          create: {
            org_id: org_id,
            org_name: "",
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
            project_is_pitr_enabled: 0,
            project_name: '',
            project_last_updated_on_caa: Math.floor(new Date().getTime() / 1000),
          }
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
