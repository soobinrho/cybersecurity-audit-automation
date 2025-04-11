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
    const projects = await prisma.projects.findMany({
      where: {
        caa_user_id: userAuthenticatedID,
      },
    });
    return NextResponse.json(projects, { status: 200, statusText: "OK" });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}

export async function POST(req: NextRequest) {
  const array_projects: Array<Prisma.projectsCreateInput> = [];
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
      const project: Prisma.projectsCreateInput = {
        project_id: json_req["project_id"],
        caa_user_id: userAuthenticatedID,
        organizations: json_req["org_id_fk"],
        project_name: json_req["project_name"],
        project_is_pitr_enabled: json_req["project_is_pitr_enabled"],
        project_last_updated_on_caa:
          json_req["project_last_updated_on_caa"],
      };
      array_projects.push(project);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    let array_upsertProjects = [];
    for (const project of array_projects) {
      array_upsertProjects.push(
        prisma.projects.upsert({
          where: {
            project_id: project["project_id"],
            caa_user_id: userAuthenticatedID,
          },
          update: {
            org_id_fk: String(project["organizations"]),
            project_name: project["project_name"],
            project_is_pitr_enabled: project["project_is_pitr_enabled"],
            project_last_updated_on_caa:
              project["project_last_updated_on_caa"],
          },
          create: {
            project_id: project["project_id"],
            caa_user_id: userAuthenticatedID,
            org_id_fk: String(project["organizations"]),
            project_name: project["project_name"],
            project_is_pitr_enabled: project["project_is_pitr_enabled"],
            project_last_updated_on_caa:
              project["project_last_updated_on_caa"],
          },
        })
      );
    }

    const transaction = await prisma.$transaction(array_upsertProjects);

    if (process.env.NODE_ENV === "development") {
      console.log(transaction);
    }

    return NextResponse.json(array_projects, {
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
      const deleteProjects = await prisma.projects.deleteMany({
        where: {
          caa_user_id: userAuthenticatedID,
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteProjects);
      }

      // By convention, HTTP 204 code must not contain any body, and must
      // only contain the status code.
      return new Response(null, {
        status: 204,
      });
    } else {
      const project_id = params.get("project_id");
      if (!project_id || project_id === "") {
        return NextResponse.json(
          "Please use correct URL params to specify which organization_member you'd like to delete.",
          { status: 404, statusText: "Not Found" }
        );
      }

      const deleteProject = await prisma.projects.delete({
        where: {
          project_id: project_id,
          caa_user_id: userAuthenticatedID,
        },
      });

      if (process.env.NODE_ENV === "development") {
        console.log(deleteProject);
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
