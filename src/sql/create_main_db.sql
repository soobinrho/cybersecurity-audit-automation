-- This sql script creates main.db
-- Store only what we need. Extra data = extra liability.
CREATE TABLE organizations (
  org_id TEXT PRIMARY KEY NOT NULL,
  org_name TEXT NOT NULL COLLATE NOCASE,
  org_url TEXT NOT NULL,
  org_last_updated_on_caa TEXT NOT NULL
                            DEFAULT (unixepoch('now','subsec'))
);

CREATE TABLE users (
  user_id INTEGER PRIMARY KEY NOT NULL,
  user_email TEXT NOT NULL COLLATE NOCASE
             CHECK (user_email LIKE '%@%'),
  user_is_mfa_enabled INTEGER NOT NULL
                      CHECK (user_is_mfa_enabled BETWEEN 0 and 1)
);

CREATE TABLE projects (
  project_id TEXT PRIMARY KEY NOT NULL,
  org_id_fk TEXT NOT NULL,
  project_name TEXT NOT NULL COLLATE NOCASE,
  project_is_pitr_enabled INTEGER NOT NULL
                          CHECK (project_is_pitr_enabled BETWEEN 0 and 1),
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id)
);

CREATE TABLE tables (
  table_id INTEGER PRIMARY KEY NOT NULL,
  project_id_fk TEXT NOT NULL,
  table_name TEXT NOT NULL COLLATE NOCASE,
  table_is_rls_enabled INTEGER NOT NULL
                       CHECK (table_is_rls_enabled BETWEEN 0 and 1),
  FOREIGN KEY(project_id_fk) REFERENCES projects(project_id)
);

CREATE TABLE organization_members (
  org_id_fk TEXT NOT NULL,
  user_id_fk INTEGER NOT NULL,
  org_member_role TEXT NOT NULL,
  PRIMARY KEY (org_id_fk, user_id_fk),
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id),
  FOREIGN KEY(user_id_fk) REFERENCES users(user_id)
);

CREATE TABLE logs (
  log_id INTEGER PRIMARY KEY NOT NULL,
  org_id_fk TEXT,
  user_id_fk INTEGER,
  project_id_fk TEXT,
  table_id_fk INTEGER,
  PRI INTEGER NOT NULL,
  VER INTEGER NOT NULL,
  TIMESTAMP INTEGER NOT NULL
            DEFAULT (unixepoch('now','subsec')),
  HOSTNAME TEXT NOT NULL COLLATE NOCASE,
  APPNAME TEXT NOT NULL COLLATE NOCASE,
  PROCID TEXT NOT NULL COLLATE NOCASE,
  STRUCTURED_DATA TEXT NOT NULL,
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id),
  FOREIGN KEY(user_id_fk) REFERENCES users(user_id),
  FOREIGN KEY(project_id_fk) REFERENCES projects(project_id),
  FOREIGN KEY(table_id_fk) REFERENCES tables(table_id)
);

