# caa

TODO:  Add a screenshot of the dashboard using https://screenbean.brunnerliv.io/

TODO: 

```py
# Ubuntu
cd caa-supabase
sudo apt install python3-full python3-pip
python -m venv .venv
.venv/bin/python src/python/caa_supabase_uid_\{USER_UID\}.py


# Windows
# Download:
#   https://www.python.org/downloads/windows/

# TODO: On Windows, I need to remove Python and test if everything works.
```

This project's purpose is to help you with compliance and regulations by using various automation technologies, and to do so in a way that does not access, transmit, or store any of your sensitive information, such as your API tokens, GLB data (customer data), or PCI data (card numbers).

I am in a unique position where I can create a web app that understands the everyday needs of CyberGRC teams (Cybersecurity Governance, Risk, and Compliance) because I'm in one of them.

<br>

## How to spin up a dev server

```bash
# Install the dependencies.
git clone https://github.com/soobinrho/caa-supabase.git
cd caa-supabase
pnpm install

# Create a random string required by Auth.js for encryption.
cp .env.local.example .env.local
pnpm npx auth secret

# Initialize Prisma objects for the database.
pnpm npx prisma db push --schema ./src/database/prisma/schema.prisma
pnpm npx prisma generate --schema src/database/prisma/schema.prisma

# Run a dev server.
pnpm dev
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

| **Resource** | **GET** | **POST** | **DELETE** |
| ------------ | ------- | -------- | ------- |
| `/api/v1/organizations` | Retrieve all orgs. | Create or update orgs. | Delete one or more orgs. |
| `/api/v1/users` | Retrieve all users. | Create or update users. | Delete one or more users. |
| `/api/v1/organization_members` | Retrieve all org members. | Create or update org members. | Delete one or more org members. |
| `/api/v1/projects` | Retrieve all projects. | Create or update projects. | Delete one or more projects. |
| `/api/v1/tables` | Retrieve all tables. | Create or update tables. | Delete one or more tables. |
| `/api/v1/logs` | Retrieve all logs. | Push a new record of logs. | N/A (Logs must not be edited or deleted) |

<br>
