// To ensure that there's only one instance of Prisma created, create the
// client here once and reuse it everywhere else.
// Source:
//   https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prismaclient-in-long-running-applications
import { PrismaClient } from '@prisma/client'

let prisma = new PrismaClient({
    log:
        process.env.NODE_ENV === 'development'
            ? ['info', 'warn', 'error']
            : ['error'],
    errorFormat: 'pretty'
})

export default prisma