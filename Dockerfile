FROM node AS base

LABEL com.cybersecurity-audit-automation.description="https://github.com/soobinrho/cybersecurity-audit-automation"
LABEL com.cybersecurity-audit-automation.maintainer="Soobin Rho <soobin@nsustain.com>"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---------------------------------------------------------------------
# Install dependencies.
# ---------------------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY . .
RUN pnpm i --frozen-lockfile

# ---------------------------------------------------------------------
# Build production files.
# ---------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY ./src/database ./src/database
RUN pnpm npx prisma db push --schema ./src/database/prisma/schema.prisma
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# ---------------------------------------------------------------------
# Run node through pnpm and Next.js
# ---------------------------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs --chmod=700 /app/src/database ./src/database
COPY --chown=nextjs:nodejs --chmod=755 ./src/python ./src/python
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY ./.env* ./
USER nextjs

# Unlike RUN, which runs commands at the build time,
# CMD is what the image runs when we use "docker run ..."
# The difference between CMD and ENTRYPOINT is that
# extra arguments at "docker run <HERE>" override CMD,
# while ENTRYPOINT is still preserved.

# "The best use for ENTRYPOINT is to set the image’s main command,
# allowing that image to be run as though it was that command
# (and then use CMD as the default flags)."
# Example:
#   ENTRYPOINT ["s3cmd"]
#   CMD ["--help"]
# Source:
#   https://docs.docker.com/develop/develop-images/dockerfile_best-practices/

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENTRYPOINT ["node"]
CMD ["server.js"]
