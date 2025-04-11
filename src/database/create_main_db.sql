-- "Data is more important than code, therefore the most important job you,
-- as a programmer, have is to design a system that allows for a simple,
-- constrained, and predictable set of data."
-- Source:
--   https://www.semicolonandsons.com/episode/data-integrity-null-constraint-check-constraint

-- This file was used when I initially had to create a Prisma schema.
-- Reference:
--   https://www.prisma.io/docs/orm/prisma-schema/introspection
-- 
-- How I created schema.prisma:
--     >> cd caa-supabase
--     >> sqlite3 ./src/database/main.db < ./src/database/create_main_db.sql
--
--     >> cat > ./src/database/prisma/schema.prisma <<EOL
--        datasource db {
--          provider = "sqlite"
--          url      = "file:../main.db"
--        }
--
--        generator client {
--          provider = "prisma-client-js"
--        }
--        EOL
--
--     >> pnpm npx prisma db pull --schema=./src/database/prisma/schema.prisma
--     >> pnpm npx prisma generate --schema=./src/database/prisma/schema.prisma
--
-- Also, note that whenever schema.prisma has changed, we need to update the
-- Prisma code by re-running `pnpm npx prisma generate --schema=...`
-- Source:
--   https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction#5-evolving-your-application
CREATE TABLE organizations (
  org_id TEXT PRIMARY KEY NOT NULL,
  org_name TEXT NOT NULL COLLATE NOCASE,
  org_last_updated_on_caa INTEGER NOT NULL
                            DEFAULT (unixepoch('now','subsec'))
);

CREATE TABLE users (
  user_email TEXT PRIMARY KEY NOT NULL COLLATE NOCASE,
  user_is_mfa_enabled INTEGER NOT NULL
                      CHECK (user_is_mfa_enabled BETWEEN 0 and 1),
  user_last_updated_on_caa INTEGER NOT NULL
                             DEFAULT (unixepoch('now','subsec'))
);

CREATE TABLE projects (
  project_id TEXT PRIMARY KEY NOT NULL,
  org_id_fk TEXT NOT NULL,
  project_name TEXT NOT NULL COLLATE NOCASE,
  project_is_pitr_enabled INTEGER NOT NULL
                          CHECK (project_is_pitr_enabled BETWEEN 0 and 1),
  project_last_updated_on_caa INTEGER NOT NULL
                                DEFAULT (unixepoch('now','subsec')),
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id)
);

CREATE TABLE tables (
  project_id_fk TEXT NOT NULL,
  table_name TEXT NOT NULL COLLATE NOCASE,
  table_is_rls_enabled INTEGER NOT NULL
                       CHECK (table_is_rls_enabled BETWEEN 0 and 1),
  table_last_updated_on_caa INTEGER NOT NULL
                              DEFAULT (unixepoch('now','subsec')),
  PRIMARY KEY (project_id_fk, table_name),
  FOREIGN KEY(project_id_fk) REFERENCES projects(project_id)
);

CREATE TABLE organization_members (
  org_id_fk TEXT NOT NULL,
  user_email_fk TEXT NOT NULL,
  org_member_role TEXT NOT NULL,
  PRIMARY KEY (org_id_fk, user_email_fk),
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id),
  FOREIGN KEY(user_email_fk) REFERENCES users(user_email)
);

CREATE TABLE logs (
  log_id INTEGER PRIMARY KEY NOT NULL,
  org_id_fk TEXT,
  user_email_fk TEXT,
  project_id_fk TEXT,
  PRI INTEGER NOT NULL,
  VER INTEGER NOT NULL,
  TIMESTAMP TEXT NOT NULL,
  HOSTNAME TEXT NOT NULL COLLATE NOCASE,
  APPNAME TEXT NOT NULL COLLATE NOCASE,
  PROCID TEXT NOT NULL COLLATE NOCASE,
  MSG TEXT NOT NULL,
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id),
  FOREIGN KEY(user_email_fk) REFERENCES users(user_email),
  FOREIGN KEY(project_id_fk) REFERENCES projects(project_id)
);

