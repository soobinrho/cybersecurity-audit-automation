# caa

This project's purpose is to help you with compliance and regulations by using various automation technologies, and to do so in a way that does not access, transmit, or store any of your sensitive information, such as your API tokens, GLB data (customer data), or PCI data (card numbers).

I am in a unique position where I can create a web app that understands the everyday needs of CyberGRC teams (Cybersecurity Governance, Risk, and Compliance) because I'm in one of them.

<br>

## How to spin up a dev server

```bash
git clone https://github.com/soobinrho/caa-supabase.git
cd caa-supabase
npm install
npm run dev
```

<br>

## How I deploy caa for prod

First, ...
Then, ...

```bash
git clone https://github.com/soobinrho/caa-supabase.git
cd caa-supabase
# TODO: ...
```

<br>

## Architecture

| ***Stack*** | ***Description*** |
| ----------- | ----------------- |
| ***Server*** | Hetzner CPX21: Ubuntu, 3 vCPU, 4GB RAM, 80GB SSD |
| ***Database*** | libSQL (SQLite) |
| ***Backend*** | Next.js, Python (used client side for collecting security controls status) |
| ***Frontend*** | Next.js, Tailwind CSS, TypeScript |
| ***CDN*** | Cloudflare (CDN & web application fire wall) |

<br>

## Security Controls Supported

### 1. MFA (Multi Factor Authentication)

- https://github.com/supabase/supabase/blob/master/apps/studio/data/organization-members/organization-roles-query.ts
- member.mfa_enabled
- HTTP GET request to /platform/organizations/{slug}/roles

<br>

### 2. RLS (Row Level Security)

- https://github.com/supabase/supabase/blob/master/apps/studio/data/table-editor/table-editor-query-sql.ts
- table.rls_enabled
- post('/platform/pg-meta/{ref}/query')
- Remediation: patch('/platform/pg-meta/{ref}/tables')
- https://github.com/supabase/supabase/blob/master/apps/studio/data/tables/table-update-mutation.ts#L22
- https://github.com/supabase/supabase/blob/master/apps/studio/components/interfaces/Auth/Policies/Policies.tsx

<br>

### 3. PITR (Point-In-Time Recovery)

- https://github.com/supabase/supabase/blob/master/apps/studio/data/database/backups-query.ts
- backups?.pitr_enabled
- HTTP GET request to `/platform/database/{ref}/backups`

It's possible to query for security controls using API's, but I decided to not go this route so that all credentials stay in the user's hands and never leave their environment.

<br>

## API Endpoints

| **Resource** | **GET** | **POST** | **PUT** |
| ------------ | ------- | -------- | ------- |
| `/api/v1/organization_members` | Retrieve all org members. | Create or overwrite a new record of org members. | Make an update on org members. |
| `/api/v1/organizations` | Retrieve all orgs. | Create or overwrite a new record of orgs. | Make an update on orgs. |
| `/api/v1/users` | Retrieve all users. | Create or overwrite a new record of users. | Make an update on users. |
| `/api/v1/projects` | Retrieve all projects. | Create or overwrite a new record of projects. | Make an update on projects. |
| `/api/v1/tables` | Retrieve all tables. | Create or overwrite a new record of tables. | Make an update on tables. |
| `/api/v1/logs` | Retrieve all logs. | Push a new record of logs. | N/A (Logs must not be edited or deleted) |

<br>
