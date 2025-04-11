import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import checkAuthenticationForAPI from "@/lib/checkAuthenticationForAPI";
import { auth } from "@/auth";
import { getProjects } from "@/lib/getProjects";

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
    const results = await getProjects(userAuthenticatedID);
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
            'The request payload must be an array. It can even be an array with only one member such as "[{...}]"',
        },
        { status: 400, statusText: "Bad Request" }
      );
    }

    const array_projectsCreateInput = [];
    for (const json_req of req_payload) {
      const project_id = json_req["project_id"];
      const project_name = json_req["project_name"];
      const project_is_pitr_enabled = json_req["project_is_pitr_enabled"];
      const project_last_updated_on_caa =
        json_req["project_last_updated_on_caa"];
      if (
        typeof project_id !== "string" ||
        project_id === "" ||
        typeof project_name !== "string" ||
        project_name === "" ||
        isNaN(parseInt(project_is_pitr_enabled)) ||
        (parseInt(project_is_pitr_enabled) !== 0 &&
          parseInt(project_is_pitr_enabled) !== 1) ||
        isNaN(parseInt(project_last_updated_on_caa))
      ) {
        return NextResponse.json(
          { message: "Missing required fields." },
          { status: 400, statusText: "Bad Request" }
        );
      }
      const projectsCreateInput: Prisma.projectsCreateInput = {
        caa_user_id: userAuthenticatedID,
        project_id: project_id,
        project_name: project_name,
        project_is_pitr_enabled: project_is_pitr_enabled,
        project_last_updated_on_caa: project_last_updated_on_caa,
      };
      const org_id = json_req["org_id"];
      if (typeof org_id === "string" && org_id !== "") {
        projectsCreateInput.organizations = {
          connectOrCreate: {
            where: { org_id: org_id },
            create: {
              caa_user_id: userAuthenticatedID,
              org_id: org_id,
              org_name: "",
              org_last_updated_on_caa: Math.floor(Date.now() / 1000),
            },
          },
        };
      }
      array_projectsCreateInput.push(projectsCreateInput);
    }

    const array_upsertProjects = [];
    for (const project of array_projectsCreateInput) {
      if (project.organizations?.connectOrCreate) {
        const org_id = project.organizations.connectOrCreate.where
          .org_id as string;
        array_upsertProjects.push(
          prisma.projects.upsert({
            where: {
              caa_user_id: userAuthenticatedID,
              project_id: project.project_id,
            },
            update: {
              organizations: {
                connectOrCreate: {
                  where: {
                    org_id: org_id,
                  },
                  create: {
                    caa_user_id: userAuthenticatedID,
                    org_id: org_id,
                    org_name: "",
                    org_last_updated_on_caa: Math.floor(Date.now() / 1000),
                  },
                },
              },
              project_name: project.project_name,
              project_is_pitr_enabled: project.project_is_pitr_enabled,
              project_last_updated_on_caa:
                project.project_last_updated_on_caa,
            },
            create: {
              caa_user_id: userAuthenticatedID,
              organizations: {
                connectOrCreate: {
                  where: {
                    org_id: org_id,
                  },
                  create: {
                    caa_user_id: userAuthenticatedID,
                    org_id: org_id,
                    org_name: "",
                    org_last_updated_on_caa: Math.floor(Date.now() / 1000),
                  },
                },
              },
              project_id: project.project_id,
              project_name: project.project_name,
              project_is_pitr_enabled: project.project_is_pitr_enabled,
              project_last_updated_on_caa:
                project.project_last_updated_on_caa,
            },
          })
        );
      } else {
        array_upsertProjects.push(
          prisma.projects.upsert({
            where: {
              caa_user_id: userAuthenticatedID,
              project_id: project.project_id,
            },
            update: {
              project_name: project.project_name,
              project_is_pitr_enabled: project.project_is_pitr_enabled,
              project_last_updated_on_caa:
                project.project_last_updated_on_caa,
            },
            create: {
              caa_user_id: userAuthenticatedID,
              project_id: project.project_id,
              project_name: project.project_name,
              project_is_pitr_enabled: project.project_is_pitr_enabled,
              project_last_updated_on_caa:
                project.project_last_updated_on_caa,
            },
          })
        );
      }
    }

    const transaction = await prisma.$transaction(array_upsertProjects);

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
      if (typeof project_id !== "string" || project_id === "") {
        return NextResponse.json("Please use correct URL params.", {
          status: 404,
          statusText: "Not Found",
        });
      }

      const deleteProject = await prisma.projects.delete({
        where: {
          caa_user_id: userAuthenticatedID,
          project_id: project_id,
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
