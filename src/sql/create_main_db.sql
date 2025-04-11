-- This sql script creates main.db
CREATE TABLE Applications (
  ApplicationID INTEGER PRIMARY KEY NOT NULL,
  ApplicationName TEXT NOT NULL COLLATE NOCASE,
  ApplicationStatus TEXT NOT NULL COLLATE NOCASE
                    CHECK (ApplicationStatus IN ('Active', 'Inactive'),
  TimeAddedTocaa INTEGER NOT NULL DEFAULT (unixepoch('now','subsec'))
);

CREATE TABLE Users (
  UserID INTEGER PRIMARY KEY NOT NULL,
  FirstName TEXT NOT NULL COLLATE NOCASE,
  LastName TEXT NOT NULL COLLATE NOCASE,
  Email TEXT NOT NULL COLLATE NOCASE
        CHECK (Email LIKE '%@%'),
  Group TEXT COLLATE NOCASE
);

CREATE TABLE Databases (
  DatabaseID INTEGER PRIMARY KEY NOT NULL,
  DatabaseName TEXT NOT NULL COLLATE NOCASE,
  AccessPoint TEXT NOT NULL COLLATE NOCASE 
);

CREATE TABLE Tables (
  TableID INTEGER PRIMARY KEY NOT NULL,
  TableName TEXT NOT NULL COLLATE NOCASE,
  DatabaseID_fk INTEGER NOT NULL,
  FOREIGN KEY(DatabaseID_fk) REFERENCES Databases(DatabaseID)
);

CREATE TABLE Projects (
  ProjectID INTEGER PRIMARY KEY NOT NULL,
  ProjectName TEXT NOT NULL COLLATE NOCASE 
);

CREATE TABLE UsersRegisteredInApplication (
  UserID_fk INTEGER NOT NULL,
  ApplicationID_fk INTEGER NOT NULL,
  IsMFAEnabled BOOLEAN NOT NULL,
  UserNote TEXT,
  PRIMARY KEY (UserID_fk, ApplicationID_fk),
  FOREIGN KEY(UserID_fk) REFERENCES Users(UserID),
  FOREIGN KEY(ApplicationID_fk) REFERENCES Applications(ApplicationID_fk)
);

CREATE TABLE ProjectsRegisteredInApplication (
  ProjectID_fk INTEGER NOT NULL,
  ApplicationID_fk INTEGER NOT NULL,
  IsPITREnabled BOOLEAN NOT NULL,
  ProjectNote TEXT,
  PRIMARY KEY (ProjectID_fk, ApplicationID_fk),
  FOREIGN KEY(ProjectID_fk) REFERENCES Projects(ProjectID),
  FOREIGN KEY(ApplicationID_fk) REFERENCES Applications(ApplicationID_fk)
);

CREATE TABLE DatabasesUsedByApplication (
  DatabaseID_fk INTEGER NOT NULL,
  ApplicationID_fk INTEGER NOT NULL,
  DatabaseNote TEXT,
  PRIMARY KEY (DatabaseID_fk, ApplicationID_fk),
  FOREIGN KEY(DatabaseID_fk) REFERENCES Databases(DatabaseID),
  FOREIGN KEY(ApplicationID_fk) REFERENCES Applications(ApplicationID_fk)
);

CREATE TABLE TablesUsedByApplication (
  TableID_fk INTEGER NOT NULL,
  ApplicationID_fk INTEGER NOT NULL,
  IsRowLevelSecurityEnabled BOOLEAN NOT NULL,
  TableNote TEXT,
  PRIMARY KEY (TableID_fk, ApplicationID_fk),
  FOREIGN KEY(TableID_fk) REFERENCES Tables(TableID),
  FOREIGN KEY(ApplicationID_fk) REFERENCES Applications(ApplicationID_fk)
);

CREATE TABLE Logs (
  LogID INTEGER PRIMARY KEY NOT NULL,
  ApplicationID_fk INTEGER,
  UserID_fk INTEGER,
  DatabaseID_fk INTEGER,
  TableID_fk INTEGER,
  TimeRecorded INTEGER NOT NULL DEFAULT (unixepoch('now','subsec')),
  LogMessage TEXT NOT NULL COLLATE NOCASE,
  FOREIGN KEY(ApplicationID_fk) REFERENCES Applications(ApplicationID_fk)
  FOREIGN KEY(UserID_fk) REFERENCES Users(UserID),
  FOREIGN KEY(DatabaseID_fk) REFERENCES Databases(DatabaseID),
  FOREIGN KEY(TableID_fk) REFERENCES Tables(TableID),
);

