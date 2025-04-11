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
          org_name: organization['org_name'] + "YES YES",
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