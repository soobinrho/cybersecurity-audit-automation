import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const logs = await prisma.logs.findMany()
    return NextResponse.json(
      logs,
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
  let log: Prisma.logsCreateInput
  try {
    const req_payload = await req.json()
    log = {
        PRI: req_payload['PRI'],
        VER: req_payload['VER'],
        TIMESTAMP: req_payload['TIMESTAMP'],
        HOSTNAME: req_payload['HOSTNAME'],
        APPNAME: req_payload['APPNAME'],
        PROCID: req_payload['PROCID'],
        MSG: req_payload['MSG'],
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      'Error occurred.',
      { status: 400, statusText: 'Bad Request' }
    )
  }

  try {
    const createLog = await prisma.logs.create({
        data: log
    })

    if (process.env.NODE_ENV === 'development') {
      console.log(createLog)
    }

    return NextResponse.json(
      createLog,
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