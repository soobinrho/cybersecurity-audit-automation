import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const organizationMembers = await prisma.organization_members.findMany();
    return NextResponse.json(organizationMembers, {
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
  const array_organizationMember: Array<Prisma.organization_membersCreateInput> =
    [];
  try {
    const req_payload = await req.json();
    for (const json_req of req_payload) {
      const user: Prisma.organization_membersCreateInput = {
        organizations: json_req["org_id_fk"],
        users: json_req["user_email_fk"],
        org_member_role: json_req["org_member_role"],
      };
      array_organizationMember.push(user);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error occurred.", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    for (const organizationMember of array_organizationMember) {
      await prisma.organization_members.upsert({
        where: {
          org_id_fk_user_email_fk: {
            org_id_fk: String(organizationMember["organizations"]),
            user_email_fk: String(organizationMember["users"]),
          },
        },
        update: {
          org_member_role: organizationMember["org_member_role"],
        },
        create: {
          org_id_fk: String(organizationMember["organizations"]),
          user_email_fk: String(organizationMember["users"]),
          org_member_role: organizationMember["org_member_role"],
        },
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.log(array_organizationMember);
    }

    return NextResponse.json(array_organizationMember, {
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
  try {
    const delete_all = params.get("delete_all")?.toLowerCase();
    if (delete_all === "true") {
      const deleteTables = prisma.tables.deleteMany();
      const deleteProjects = prisma.projects.deleteMany();
      const deleteOrganizationMembers =
        prisma.organization_members.deleteMany();
      const transaction = await prisma.$transaction([
        deleteTables,
        deleteProjects,
        deleteOrganizationMembers,
      ]);

      if (process.env.NODE_ENV === "development") {
        console.log(transaction);
      }

      // By convention, HTTP 204 code must not contain any body, and must
      // only contain the status code.
      return new Response(null, {
        status: 204,
      });
    } else {
      const org_id_fk = params.get("org_id_fk");
      const user_email_fk = params.get("user_email_fk");
      if (
        !org_id_fk ||
        org_id_fk === "" ||
        !user_email_fk ||
        user_email_fk === ""
      ) {
        return NextResponse.json(
          "Please use correct URL params to specify which organization_member you'd like to delete.",
          { status: 404, statusText: "Not Found" }
        );
      }

      const deleteOrganizationMember = await prisma.organization_members.delete(
        {
          where: {
            org_id_fk_user_email_fk: {
              org_id_fk: org_id_fk,
              user_email_fk: user_email_fk,
            },
          },
        }
      );

      if (process.env.NODE_ENV === "development") {
        console.log(deleteOrganizationMember);
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
