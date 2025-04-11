import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const projects = await prisma.projects.findMany()
    return NextResponse.json(
      projects,
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
  let array_projects: Array<Prisma.projectsCreateInput> = []

  try {
    const req_payload = await req.json()
    for (const json_req of req_payload) {
      const project: Prisma.projectsCreateInput = {
          project_id: json_req['project_id'],
          organizations: json_req['org_id_fk'],
          project_name: json_req['project_name'],
          project_is_pitr_enabled: json_req['project_is_pitr_enabled'],
          project_last_updated_on_caa: json_req['project_last_updated_on_caa'],
      }
      array_projects.push(project)
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      'Error occurred.',
      { status: 400, statusText: 'Bad Request' }
    )
  }

  try {
    for (const project of array_projects) {
      const upsertProject = await prisma.projects.upsert({
        where: {
          project_id: project['project_id']
        },
        update: {
          org_id_fk: String(project['organizations']),
          project_name: project['project_name'],
          project_is_pitr_enabled: project['project_is_pitr_enabled'],
          project_last_updated_on_caa: project['project_last_updated_on_caa'],
        },
        create: {
          project_id: project['project_id'],
          org_id_fk: String(project['organizations']),
          project_name: project['project_name'],
          project_is_pitr_enabled: project['project_is_pitr_enabled'],
          project_last_updated_on_caa: project['project_last_updated_on_caa'],
        }
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(array_projects)
    }

    return NextResponse.json(
      array_projects,
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