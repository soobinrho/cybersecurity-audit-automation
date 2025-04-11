<br>

![Screenshot 2025-04-04 225149](https://github.com/user-attachments/assets/5f7ae117-24ae-4864-9b1c-f029a95a6c23)

<br>

# Cybersecurity Audit Automation

The purpose of this project is to help you automate your own cybersecurity compliance posture by using technology we have available today, and to do so in a way that does not access, transmit, or store any of your sensitive information, such as your API keys, GLB data (customer data), or PCI data (card numbers).

<br>

## How to spin up a dev server

```bash
# Install the dependencies.
git clone https://github.com/soobinrho/cybersecurity-audit-automation.git
cd cybersecurity-audit-automation
pnpm install

# Fill in sensitive env variables for development and production.
cp .env.development.local.example .env.development.local
cp .env.production.local.example .env.production.local

# Create a random string required by Auth.js for encryption.
pnpm npx auth secret --copy >> .env.development.local
pnpm npx auth secret --copy >> .env.production.local

# Initialize Prisma objects for the database.
pnpm npx prisma db push --schema ./src/database/prisma/schema.prisma

# Run a dev server.
pnpm dev
```

<br>

## How I deploy for prod

Run the web app and Nginx using Docker Compose.

```bash
git clone https://github.com/soobinrho/cybersecurity-audit-automation.git
cd cybersecurity-audit-automation

# Fill in sensitive env variables for development and production.
cp .env.production.local.example .env.production.local

# Create a random string required by Auth.js for encryption.
pnpm npx auth secret --copy >> .env.production.local

# Build based on `Dockerfile`, `Dockerfile.nginx`, and `compose.yaml`.
cp docker/nginx.conf.beforeCertbot docker/nginx.conf
sudo docker compose build
sudo docker compose up -d
```

Set up an HTTPS certificate using Certbot.
Before running in Letsencrypt's prod server, test in the staging server first like this:

```bash
cd cybersecurity-audit-automation
docker compose exec nginx certbot certonly --text --non-interactive \
  --agree-tos --verbose --keep-until-expiring --webroot \
  --webroot-path /var/www/letsencrypt/ \
  --server https://acme-staging-v02.api.letsencrypt.org/directory \
  --rsa-key-size 4096 \
  --email <your_email> \
  --preferred-challenges=http \
  -d <your_domain_name>
```

After you pass the tests in the staging server, issue the certs in prod.

```bash
cd cybersecurity-audit-automation
docker compose exec nginx certbot certonly --text --non-interactive \
  --agree-tos --verbose --keep-until-expiring --webroot \
  --webroot-path /var/www/letsencrypt/ \
  --server https://acme-v02.api.letsencrypt.org/directory \
  --rsa-key-size 4096 \
  --email <your_email> \
  --preferred-challenges=http \
  -d <your_domain_name>
```

Finally, switch out the `nginx.conf`.
The first one runs in HTTP, while the new one directs all traffic to HTTPS.

```bash
cd cybersecurity-audit-automation
cp docker/nginx.conf.afterCertbot docker/nginx.conf
```

This is not a required step, but I also prefer to set up a cron job so that the certbot automatically renews before it expires without us having to manually do so.

```bash
# Example:
sudo ln -s /home/soobinrho/git/cybersecurity-audit-automation/docker/certbot_runner /etc/cron.daily/certbot_runner

# Also, Docker stores various temporary files, such as filesystem layers at
# `/var/lib/docker/overlay2`, and this can grow fast -- e.g. 70GB in a week.
# So, set up a cron job to clean this daily.
sudo ln -s /home/soobinrho/git/cybersecurity-audit-automation/docker/docker_prune_runner /etc/cron.daily/docker_prune_runner
```

<br>

## Useful workflows

### How I redeploy whenever a new change has been made

```bash
# First, ssh into the server.
ssh cybersecurity-audit-automation
cd cybersecurity-audit-automation
git pull

# Rebuild the docker image and redeploy.
sudo docker compose build
sudo docker compose down; sudo docker compose up -d
```

<br>

### How I debug docker images

```bash
# How to run a shell inside the web app container.
sudo docker compose exec -it cybersecurity-audit-automation sh

# How to run a shell inside the nginx container.
sudo docker compose exec -it nginx sh

# How to read the Nginx and Next.js logs.
sudo docker compose logs | ccze -m ansi -o nolookups | less -R  # Color code all logs.
sudo docker compose logs -f  # Listen in real time.
```

<br>

## Architecture

| **_Stack_**    | **_Description_**                                                          |
| -------------- | -------------------------------------------------------------------------- |
| **_Server_**   | Hetzner CPX11: Ubuntu, 2 vCPU, 2GB RAM, 40GB SSD                           |
| **_Database_** | SQLite, Prisma                                                             |
| **_Backend_**  | Next.js, Python (used client side for collecting security controls status) |
| **_Frontend_** | Next.js, Tailwind CSS, TypeScript                                          |
| **_CDN_**      | Cloudflare (CDN & web application fire wall)                               |

<br>

## API Endpoints

| **Resource**                   | **GET**                   | **POST**                      | **DELETE**                               |
| ------------------------------ | ------------------------- | ----------------------------- | ---------------------------------------- |
| `/api/v1/organizations`        | Retrieve all orgs.        | Create or update orgs.        | Delete one or more orgs.                 |
| `/api/v1/users`                | Retrieve all users.       | Create or update users.       | Delete one or more users.                |
| `/api/v1/organization_members` | Retrieve all org members. | Create or update org members. | Delete one or more org members.          |
| `/api/v1/projects`             | Retrieve all projects.    | Create or update projects.    | Delete one or more projects.             |
| `/api/v1/tables`               | Retrieve all tables.      | Create or update tables.      | Delete one or more tables.               |
| `/api/v1/logs`                 | Retrieve all logs.        | Push a new record of logs.    | N/A (Logs must not be edited or deleted) |

<br>

<!--

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

-->
