-- "Data is more important than code, therefore the most important job you,
-- as a programmer, have is to design a system that allows for a simple,
-- constrained, and predictable set of data."
-- Source:
--   https://www.semicolonandsons.com/episode/data-integrity-null-constraint-check-constraint

-- This file was used when I initially had to create a Prisma schema.
-- Thereafter, I use the generated schema with added changes on top of it.
-- Thus, the following steps are not for most use cases; instead, do this
-- only if you want to reset and generate a new schema.
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
-- After that, I manually go to the schema.prisma and set all foreign key constraint
-- actions to `Cascade`.
--
-- Also, note that whenever schema.prisma has changed, we need to update the
-- Prisma code by re-running `pnpm npx prisma generate --schema=...`
-- Source:
--   https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction#5-evolving-your-application
CREATE TABLE organizations (
  caa_user_id TEXT NOT NULL COLLATE NOCASE,
  org_id TEXT PRIMARY KEY NOT NULL,
  org_name TEXT NOT NULL COLLATE NOCASE,
  org_last_updated_on_caa INTEGER NOT NULL
);

CREATE TABLE users (
  caa_user_id TEXT NOT NULL COLLATE NOCASE,
  user_email TEXT PRIMARY KEY NOT NULL COLLATE NOCASE,
  user_is_mfa_enabled INTEGER NOT NULL
                      CHECK (user_is_mfa_enabled BETWEEN 0 and 1),
  user_last_updated_on_caa INTEGER NOT NULL
);

CREATE TABLE projects (
  caa_user_id TEXT NOT NULL COLLATE NOCASE,
  project_id TEXT PRIMARY KEY NOT NULL,
  org_id_fk TEXT,
  project_name TEXT NOT NULL COLLATE NOCASE,
  project_is_pitr_enabled INTEGER NOT NULL
                          CHECK (project_is_pitr_enabled BETWEEN 0 and 1),
  project_last_updated_on_caa INTEGER NOT NULL,
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id)
);

CREATE TABLE tables (
  caa_user_id TEXT NOT NULL COLLATE NOCASE,
  project_id_fk TEXT NOT NULL,
  table_name TEXT NOT NULL COLLATE NOCASE,
  table_is_rls_enabled INTEGER NOT NULL
                       CHECK (table_is_rls_enabled BETWEEN 0 and 1),
  table_last_updated_on_caa INTEGER NOT NULL,
  PRIMARY KEY (project_id_fk, table_name),
  FOREIGN KEY(project_id_fk) REFERENCES projects(project_id)
);

CREATE TABLE organization_members (
  caa_user_id TEXT NOT NULL COLLATE NOCASE,
  org_id_fk TEXT NOT NULL,
  user_email_fk TEXT NOT NULL,
  org_member_role TEXT NOT NULL,
  PRIMARY KEY (org_id_fk, user_email_fk),
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id),
  FOREIGN KEY(user_email_fk) REFERENCES users(user_email)
);

CREATE TABLE evidence_images (
  caa_user_id TEXT NOT NULL COLLATE NOCASE,
  evidence_image_id INTEGER PRIMARY KEY NOT NULL,
  org_id_fk TEXT NULL,
  user_email_fk TEXT NULL,
  project_id_fk TEXT NULL,
  table_name_fk TEXT NULL,
  evidence_what_for TEXT NOT NULL,
  evidence_image_name TEXT NOT NULL,
  evidence_image_size INTEGER NOT NULL
                      CHECK (evidence_image_size > 0),
  evidence_image_blob BLOB NOT NULL,
  evidence_image_last_updated_on_caa INTEGER NOT NULL,
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id),
  FOREIGN KEY(user_email_fk) REFERENCES users(user_email),
  FOREIGN KEY(project_id_fk) REFERENCES projects(project_id)
  -- Here, I don't create a foreign key reference for the 
  -- "tables" table because it has a composite primary key
  -- which would make prisma schema file too complex to create.
  -- Thus, the "tables" table is not linked as a foreign key,
  -- but rather as a static value.
);

CREATE TABLE client_side_api_keys (
  caa_user_id TEXT NOT NULL COLLATE NOCASE,
  client_side_api_key_id INTEGER PRIMARY KEY NOT NULL,
  client_side_api_key_hashed_value TEXT NOT NULL,
  client_side_api_key_is_active INTEGER NOT NULL
                                CHECK (client_side_api_key_is_active BETWEEN 0 and 1),
  client_side_api_key_time_generated INTEGER NOT NULL
);

-- No foreign key constraints because logs should never be mutated.
CREATE TABLE logs (
  caa_user_id TEXT NOT NULL COLLATE NOCASE,
  client_side_api_key_id_fk INTEGER,
  log_id INTEGER PRIMARY KEY NOT NULL,
  org_id_fk TEXT,
  user_email_fk TEXT,
  project_id_fk TEXT,
  table_name_fk TEXT,
  evidence_image_id_fk TEXT,
  PRI_FACILITY INTEGER NOT NULL,
  PRI_SEVERITY INTEGER NOT NULL,
  VER INTEGER NOT NULL,
  TIMESTAMP TEXT NOT NULL,
  HOSTNAME TEXT NOT NULL COLLATE NOCASE,
  APPNAME TEXT NOT NULL COLLATE NOCASE,
  PROCID TEXT NOT NULL COLLATE NOCASE,
  MSG TEXT NOT NULL
);

