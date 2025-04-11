-- This sql script creates main.db
-- Store only what we need. Extra data = extra liability.
CREATE TABLE organizations (
  org_id TEXT PRIMARY KEY NOT NULL,
  org_name TEXT NOT NULL COLLATE NOCASE,
  org_last_updated_on_caa TEXT NOT NULL
                            DEFAULT (unixepoch('now','subsec'))
);

CREATE TABLE users (
  user_email TEXT PRIMARY KEY NOT NULL COLLATE NOCASE,
  user_is_mfa_enabled INTEGER NOT NULL
                      CHECK (user_is_mfa_enabled BETWEEN 0 and 1),
  user_last_updated_on_caa TEXT NOT NULL
                             DEFAULT (unixepoch('now','subsec'))
);

CREATE TABLE projects (
  project_id TEXT PRIMARY KEY NOT NULL,
  org_id_fk TEXT NOT NULL,
  project_name TEXT NOT NULL COLLATE NOCASE,
  project_is_pitr_enabled INTEGER NOT NULL
                          CHECK (project_is_pitr_enabled BETWEEN 0 and 1),
  project_last_updated_on_caa TEXT NOT NULL
                                DEFAULT (unixepoch('now','subsec')),
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id)
);

CREATE TABLE tables (
  project_id_fk TEXT NOT NULL,
  table_name INTEGER NOT NULL COLLATE NOCASE,
  table_is_rls_enabled INTEGER NOT NULL
                       CHECK (table_is_rls_enabled BETWEEN 0 and 1),
  table_last_updated_on_caa TEXT NOT NULL
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
  table_name_fk TEXT,
  PRI INTEGER NOT NULL,
  VER INTEGER NOT NULL,
  TIMESTAMP INTEGER NOT NULL
            DEFAULT (unixepoch('now','subsec')),
  HOSTNAME TEXT NOT NULL COLLATE NOCASE,
  APPNAME TEXT NOT NULL COLLATE NOCASE,
  PROCID TEXT NOT NULL COLLATE NOCASE,
  STRUCTURED_DATA TEXT NOT NULL,
  FOREIGN KEY(org_id_fk) REFERENCES organizations(org_id),
  FOREIGN KEY(user_email_fk) REFERENCES users(user_email),
  FOREIGN KEY(project_id_fk) REFERENCES projects(project_id),
  FOREIGN KEY(table_name_fk) REFERENCES tables(table_name)
);

