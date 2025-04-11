import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { organization_members, Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const organizationMembers = await prisma.organization_members.findMany()
    return NextResponse.json(
      organizationMembers,
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
  let array_organizationMember: Array<Prisma.organization_membersCreateInput> = []

  try {
    const req_payload = await req.json()
    for (const json_req of req_payload) {
      const user: Prisma.organization_membersCreateInput = {
          organizations: json_req['org_id_fk'],
          users: json_req['user_email_fk'],
          org_member_role: json_req['org_member_role'],
      }
      array_organizationMember.push(user)
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      'Error occurred.',
      { status: 400, statusText: 'Bad Request' }
    )
  }

  try {
    for (const organizationMember of array_organizationMember) {
      const upsertOrganizationMember = await prisma.organization_members.upsert({
        where: {
          org_id_fk_user_email_fk: {
            org_id_fk: String(organizationMember['organizations']),
            user_email_fk: String(organizationMember['users']),
          }
        },
        update: {
          org_member_role: organizationMember['org_member_role'],
        },
        create: {
          org_id_fk: String(organizationMember['organizations']),
          user_email_fk: String(organizationMember['users']),
          org_member_role: organizationMember['org_member_role'],
        }
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(array_organizationMember)
    }

    return NextResponse.json(
      array_organizationMember,
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
