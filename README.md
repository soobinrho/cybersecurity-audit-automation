# caa

I am in a unique position where I can create a web app that understands the everyday needs of GRC teams because I'm in one of them.
This web app (a) focuses on solving all the pain points that users have, and at the same time, (b) aims to do so without accessing, transmitting, or storing any of the user's sensitive data, such as GLB data (customer data) and PCI data (card numbers).

| ***Stack*** | ***Description*** |
| ----------- | ----------------- |
| ***Server*** | Hetzner CPX21: Ubuntu, 3 vCPU, 4GB RAM, 80GB SSD |
| ***Database*** | SQLite |
| ***Backend*** | Next.js, Python (used for cross-platform, client-side scripts for collecting security controls status) |
| ***Frontend*** | Next.js, Tailwind CSS, TypeScript |
| ***CDN*** | Cloudflare (also used for domain name and web application firewall) |

<br>

## How to spin up a dev server

```bash
git clone https://github.com/soobinrho/caa-supabase.git
cd caa-supabase
npm install
npm run dev
```

<br>

## How I deploy caa

First, ...
Then, ...

```bash
git clone https://github.com/soobinrho/caa-supabase.git
cd caa-supabase
# TODO: ...
```

<br>

## TODO

Move this section to a dedicated documentation route.
There, include how each security control is tracked and remediated.
Also, make an API page showing all routes and available protocols (GET, PUT).
I can name this section something like `## Mapped Security Controls`.

### MFA (Multi Factor Authentication)

- https://github.com/supabase/supabase/blob/master/apps/studio/data/organization-members/organization-roles-query.ts
- member.mfa_enabled
- HTTP GET request to /platform/organizations/{slug}/roles

### RLS (Row Level Security)

- https://github.com/supabase/supabase/blob/master/apps/studio/data/table-editor/table-editor-query-sql.ts
- table.rls_enabled
- post('/platform/pg-meta/{ref}/query')
- Remediation: patch('/platform/pg-meta/{ref}/tables')
- https://github.com/supabase/supabase/blob/master/apps/studio/data/tables/table-update-mutation.ts#L22
- https://github.com/supabase/supabase/blob/master/apps/studio/components/interfaces/Auth/Policies/Policies.tsx

### PITR (Point-In-Time Recovery)

- https://github.com/supabase/supabase/blob/master/apps/studio/data/database/backups-query.ts
- backups?.pitr_enabled
- HTTP GET request to `/platform/database/{ref}/backups`

It's possible to query for security controls using API's, but I decided to not go this route so that all credentials stay in the user's hands and never leave their environment.

<br>
