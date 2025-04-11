import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { json } from 'stream/consumers'

export async function GET(req: NextRequest) {
  try {
    const organizations = await prisma.organizations.findMany()
    return NextResponse.json(
      organizations,
      { status: 200, statusText: 'OK' }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      'Error occurred.',
      { status: 500, statusText: 'Internal Server Error' }
    )
  }
}

export async function POST(req: NextRequest) {
  let array_organization: Array<Prisma.organizationsCreateInput> = []
  try {
    const req_payload = await req.json()
    for (const json_req of req_payload) {
      const organization: Prisma.organizationsCreateInput = {
        org_id: json_req['org_id'],
        org_name: json_req['org_name'],
        org_last_updated_on_caa: json_req['org_last_updated_on_caa'],
      }
      array_organization.push(organization)
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      'Error occurred.',
      { status: 400, statusText: 'Bad Request' }
    )
  }

  try {
    for (const organization of array_organization) {
      const upsertOrganization = await prisma.organizations.upsert({
        where: {
          org_id: organization['org_id']
        },
        update: {
          org_name: organization['org_name'],
          org_last_updated_on_caa: organization['org_last_updated_on_caa'],
        },
        create: {
          org_id: organization['org_id'],
          org_name: organization['org_name'],
          org_last_updated_on_caa: organization['org_last_updated_on_caa'],
        }
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(array_organization)
    }

    return NextResponse.json(
      array_organization,
      { status: 201, statusText: 'Created' }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      'Error occurred.',
      { status: 500, statusText: 'Internal Server Error' }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const params = req.nextUrl.searchParams
  try {
    const delete_all = params.get('delete_all')?.toLowerCase()
    if (delete_all === 'true') {
      const deleteTables = prisma.tables.deleteMany()
      const deleteProjects = prisma.projects.deleteMany()
      const deleteOrganizationMembers = prisma.organization_members.deleteMany()
      const deleteUsers = prisma.users.deleteMany()
      const deleteOrganizations = prisma.organizations.deleteMany()
      const transaction = await prisma.$transaction([
        deleteTables,
        deleteProjects,
        deleteOrganizationMembers,
        deleteUsers,
        deleteOrganizations,
      ])

      if (process.env.NODE_ENV === 'development') {
        console.log(transaction)
      }

      // By convention, HTTP 204 code must not contain any body, and must 
      // only contain the status code.
      return new Response(null, {
        status: 204,
      })
    }

    else {
      const org_id = params.get('org_id')
      if (!org_id || org_id === '') {
        return NextResponse.json(
          "Please use correct URL params to specify which organization_member you'd like to delete.",
          { status: 404, statusText: 'Not Found' }
        )
      }

      const deleteOrganization = await prisma.organizations.delete({
        where: {
          org_id: org_id
        }
      })

      if (process.env.NODE_ENV === 'development') {
        console.log(deleteOrganization)
      }

      return new Response(null, {
        status: 204,
      })
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      "Please use correct URL params to specify which organization_member you'd like to delete.",
      { status: 404, statusText: 'Not Found' }
    )
  }
}
