-- This sql script creates main.db
-- Store only what we need. Extra data = extra liability.
CREATE TABLE Organizations (
  OrganizationID TEXT PRIMARY KEY NOT NULL,
  OrganizationName TEXT NOT NULL COLLATE NOCASE,
  OrganizationURL TEXT NOT NULL
);

CREATE TABLE Projects (
  ProjectID TEXT PRIMARY KEY NOT NULL,
  OrganizationID_fk TEXT NOT NULL,
  ProjectName TEXT NOT NULL COLLATE NOCASE,
  IsPITREnabled INTEGER NOT NULL
                CHECK (IsPITREnabled BETWEEN 0 and 1),
  FOREIGN KEY(OrganizationID_fk) REFERENCES Organizations(OrganizationID)
);

CREATE TABLE Users (
  UserID INTEGER PRIMARY KEY NOT NULL,
  Email TEXT NOT NULL COLLATE NOCASE
        CHECK (Email LIKE '%@%'),
  IsMFAEnabled INTEGER NOT NULL
               CHECK (IsMFAEnabled BETWEEN 0 and 1)
);

CREATE TABLE Tables (
  TableID INTEGER PRIMARY KEY NOT NULL,
  ProjectID_fk TEXT NOT NULL,
  TableName TEXT NOT NULL COLLATE NOCASE,
  IsRLSEnabled INTEGER NOT NULL
               CHECK (IsRLSEnabled BETWEEN 0 and 1),
  FOREIGN KEY(ProjectID_fk) REFERENCES Projects(ProjectID)
);

CREATE TABLE OrganizationsThatUsersAreIn (
  OrganizationID_fk TEXT NOT NULL,
  UserID_fk INTEGER NOT NULL,
  UserRoleInOrganization TEXT NOT NULL,
  PRIMARY KEY (OrganizationID_fk, UserID_fk),
  FOREIGN KEY(OrganizationID_fk) REFERENCES Organizations(OrganizationID),
  FOREIGN KEY(UserID_fk) REFERENCES Users(UserID)
);

CREATE TABLE Logs (
  LogID INTEGER PRIMARY KEY NOT NULL,
  OrganizationID_fk TEXT,
  UserID_fk INTEGER,
  ProjectID_fk TEXT,
  TableID_fk INTEGER,
  TimeRecorded INTEGER NOT NULL DEFAULT (unixepoch('now','subsec')),
  IsComplianceRelated INTEGER NOT NULL
                      CHECK (IsComplianceRelated BETWEEN 0 and 1),
  ComplianceStatus TEXT NOT NULL COLLATE NOCASE
                   CHECK (ComplianceStatus IN ('Pass', 'Fail', 'Not Applicable')),
  LogMessage TEXT NOT NULL COLLATE NOCASE,
  FOREIGN KEY(OrganizationID_fk) REFERENCES Organizations(OrganizationID),
  FOREIGN KEY(UserID_fk) REFERENCES Users(UserID),
  FOREIGN KEY(ProjectID_fk) REFERENCES Projects(ProjectID),
  FOREIGN KEY(TableID_fk) REFERENCES Tables(TableID)
);

