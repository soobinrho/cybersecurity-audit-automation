import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.users.findMany()
    return NextResponse.json(
      users,
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
  let array_user: Array<Prisma.usersCreateInput> = []

  try {
    const req_payload = await req.json()
    for (const json_req of req_payload) {
      const user: Prisma.usersCreateInput = {
          user_email: json_req['user_email'],
          user_is_mfa_enabled: json_req['user_is_mfa_enabled'],
          user_last_updated_on_caa: json_req['user_last_updated_on_caa'],
      }
      array_user.push(user)
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      'Error occurred.',
      { status: 400, statusText: 'Bad Request' }
    )
  }

  try {
    for (const user of array_user) {
      const upsertUser = await prisma.users.upsert({
        where: {
          user_email: user['user_email']
        },
        update: {
          user_is_mfa_enabled: user['user_is_mfa_enabled'],
          user_last_updated_on_caa: user['user_last_updated_on_caa'],
        },
        create: {
          user_email: user['user_email'],
          user_is_mfa_enabled: user['user_is_mfa_enabled'],
          user_last_updated_on_caa: user['user_last_updated_on_caa'],
        }
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(array_user)
    }

    return NextResponse.json(
      array_user,
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