-- ============================================================
-- QSARFlex screenshot database seed
-- Individual user:  demo@qsarflex.test           619bc5c0-6081-70ff-5a62-fcec8d5c1bba
-- Enterprise admin: demo-enterprise@qsarflex.test 41dbb5b0-70f1-7046-5c01-7bc9cc86cb83
-- ============================================================

-- ── Schema ────────────────────────────────────────────────────────────────────

CREATE TABLE "Users" (
    "Id"                          uuid          NOT NULL DEFAULT gen_random_uuid(),
    "Email"                       text          NOT NULL,
    "CompanyId"                   uuid,
    "CompanyAdmin"                boolean,
    "SupportDistributorCompanyId" uuid,
    "CreatedAt"                   timestamptz   NOT NULL DEFAULT '-infinity',
    "CreatedById"                 uuid,
    "UpdatedAt"                   timestamptz   NOT NULL DEFAULT '-infinity',
    "UpdatedById"                 uuid,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

CREATE TABLE "Companies" (
    "Id"                    uuid        NOT NULL DEFAULT gen_random_uuid(),
    "Name"                  text        NOT NULL,
    "IsDistributor"         boolean     NOT NULL DEFAULT false,
    "DistributorCompanyId"  uuid,
    "CreatedAt"             timestamptz NOT NULL DEFAULT '-infinity',
    "CreatedById"           uuid,
    "UpdatedAt"             timestamptz NOT NULL DEFAULT '-infinity',
    "UpdatedById"           uuid,
    CONSTRAINT "PK_Companies" PRIMARY KEY ("Id"),
    CONSTRAINT "CK_Companies_DistributorHierarchy"
        CHECK (("IsDistributor" = TRUE AND "DistributorCompanyId" IS NULL)
            OR ("IsDistributor" = FALSE AND "DistributorCompanyId" IS NOT NULL)),
    CONSTRAINT "CK_Companies_DistributorNotSelf"
        CHECK ("DistributorCompanyId" IS NULL OR "DistributorCompanyId" <> "Id")
);

CREATE TABLE "Softwares" (
    "Id"          uuid        NOT NULL DEFAULT gen_random_uuid(),
    "Name"        text        NOT NULL,
    "CreatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "CreatedById" uuid,
    "UpdatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "UpdatedById" uuid,
    CONSTRAINT "PK_Softwares" PRIMARY KEY ("Id")
);

CREATE TABLE "Bundles" (
    "Id"          uuid        NOT NULL DEFAULT gen_random_uuid(),
    "Name"        text        NOT NULL,
    "SoftwareId"  uuid        NOT NULL,
    "CreatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "CreatedById" uuid,
    "UpdatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "UpdatedById" uuid,
    CONSTRAINT "PK_Bundles" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Bundles_Softwares_SoftwareId" FOREIGN KEY ("SoftwareId") REFERENCES "Softwares"("Id") ON DELETE CASCADE
);

CREATE TABLE "Modules" (
    "Id"          uuid        NOT NULL DEFAULT gen_random_uuid(),
    "Name"        text        NOT NULL,
    "SoftwareId"  uuid        NOT NULL,
    "BundleId"    uuid,
    "Coverage"    integer     NOT NULL DEFAULT 0,
    "CreatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "CreatedById" uuid,
    "UpdatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "UpdatedById" uuid,
    CONSTRAINT "PK_Modules" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Modules_Softwares_SoftwareId" FOREIGN KEY ("SoftwareId") REFERENCES "Softwares"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Modules_Bundles_BundleId" FOREIGN KEY ("BundleId") REFERENCES "Bundles"("Id")
);

CREATE TABLE "Licenses" (
    "Id"                  uuid        NOT NULL DEFAULT gen_random_uuid(),
    "SoftwareId"          uuid        NOT NULL,
    "Coverage"            text        NOT NULL,
    "UserId"              uuid,
    "CompanyId"           uuid,
    "NumberOfUsers"       integer,
    "Type"                text        NOT NULL,
    "StartDate"           timestamptz,
    "EndDate"             timestamptz,
    "TotalTests"          integer,
    "RemainingTests"      integer,
    "Status"              text,
    "AllModulesSelected"  boolean     NOT NULL DEFAULT false,
    "OnDemand"            boolean     NOT NULL DEFAULT false,
    "ActivatedById"       uuid,
    "ActivatedTime"       timestamptz,
    "ExpiredById"         uuid,
    "ExpiredTime"         timestamptz,
    "CreatedAt"           timestamptz NOT NULL DEFAULT '-infinity',
    "CreatedById"         uuid,
    "UpdatedAt"           timestamptz NOT NULL DEFAULT '-infinity',
    "UpdatedById"         uuid,
    CONSTRAINT "PK_Licenses" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Licenses_Softwares_SoftwareId" FOREIGN KEY ("SoftwareId") REFERENCES "Softwares"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_Licenses_Companies_CompanyId" FOREIGN KEY ("CompanyId") REFERENCES "Companies"("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Licenses_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Licenses_Users_CreatedById" FOREIGN KEY ("CreatedById") REFERENCES "Users"("Id") ON DELETE RESTRICT,
    CONSTRAINT "FK_Licenses_Users_UpdatedById" FOREIGN KEY ("UpdatedById") REFERENCES "Users"("Id") ON DELETE RESTRICT
);

CREATE TABLE "LicenseModules" (
    "LicenseId"   uuid        NOT NULL,
    "ModuleId"    uuid        NOT NULL,
    "CreatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "CreatedById" uuid,
    "UpdatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "UpdatedById" uuid,
    CONSTRAINT "PK_LicenseModules" PRIMARY KEY ("LicenseId", "ModuleId"),
    CONSTRAINT "FK_LicenseModules_Licenses_LicenseId" FOREIGN KEY ("LicenseId") REFERENCES "Licenses"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_LicenseModules_Modules_ModuleId" FOREIGN KEY ("ModuleId") REFERENCES "Modules"("Id") ON DELETE CASCADE
);

CREATE TABLE "LicenseUsers" (
    "LicenseId"   uuid        NOT NULL,
    "UserId"      uuid        NOT NULL,
    "CreatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "CreatedById" uuid,
    "UpdatedAt"   timestamptz NOT NULL DEFAULT '-infinity',
    "UpdatedById" uuid,
    CONSTRAINT "PK_LicenseUsers" PRIMARY KEY ("LicenseId", "UserId"),
    CONSTRAINT "FK_LicenseUsers_Licenses_LicenseId" FOREIGN KEY ("LicenseId") REFERENCES "Licenses"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_LicenseUsers_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE
);

CREATE TABLE "LicenseUserActivities" (
    "Id"               uuid        NOT NULL DEFAULT gen_random_uuid(),
    "LicenseId"        uuid        NOT NULL,
    "UserId"           uuid        NOT NULL,
    "ActivityTime"     timestamptz NOT NULL,
    "TestsUsed"        integer     NOT NULL DEFAULT 0,
    "Billed"           boolean     NOT NULL DEFAULT false,
    "InvoiceReference" text,
    "Metadata"         text,
    "Platform"         text,
    "Version"          text,
    "CreatedAt"        timestamptz NOT NULL DEFAULT '-infinity',
    "CreatedById"      uuid,
    "UpdatedAt"        timestamptz NOT NULL DEFAULT '-infinity',
    "UpdatedById"      uuid,
    CONSTRAINT "PK_LicenseUserActivities" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_LicenseUserActivities_Licenses_LicenseId" FOREIGN KEY ("LicenseId") REFERENCES "Licenses"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_LicenseUserActivities_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE
);

CREATE TABLE "LicenseUserActivityModules" (
    "LicenseUserActivityId" uuid NOT NULL,
    "ModuleId"              uuid NOT NULL,
    CONSTRAINT "PK_LicenseUserActivityModules" PRIMARY KEY ("LicenseUserActivityId", "ModuleId"),
    CONSTRAINT "FK_LicenseUserActivityModules_LicenseUserActivities_Id" FOREIGN KEY ("LicenseUserActivityId") REFERENCES "LicenseUserActivities"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_LicenseUserActivityModules_Modules_ModuleId" FOREIGN KEY ("ModuleId") REFERENCES "Modules"("Id") ON DELETE CASCADE
);

CREATE TABLE "UserTokens" (
    "Id"         uuid        NOT NULL DEFAULT gen_random_uuid(),
    "UserId"     uuid        NOT NULL,
    "SoftwareId" uuid        NOT NULL,
    "Token"      text        NOT NULL,
    "IdToken"    text        NOT NULL,
    "IssuedAt"   timestamptz NOT NULL,
    "ExpiredAt"  timestamptz,
    CONSTRAINT "PK_UserTokens" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_UserTokens_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_UserTokens_Softwares_SoftwareId" FOREIGN KEY ("SoftwareId") REFERENCES "Softwares"("Id") ON DELETE CASCADE
);

-- Indexes
CREATE UNIQUE INDEX "IX_Softwares_Name" ON "Softwares"("Name");
CREATE UNIQUE INDEX "IX_Companies_Name" ON "Companies"("Name");
CREATE INDEX "IX_Users_CompanyId" ON "Users"("CompanyId");
CREATE INDEX "IX_Licenses_UserId" ON "Licenses"("UserId");
CREATE INDEX "IX_Licenses_CompanyId" ON "Licenses"("CompanyId");
CREATE INDEX "IX_Licenses_SoftwareId" ON "Licenses"("SoftwareId");
CREATE INDEX "IX_LicenseUsers_UserId" ON "LicenseUsers"("UserId");

-- FK constraints deferred (added after tables)
ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_Companies_CompanyId" FOREIGN KEY ("CompanyId") REFERENCES "Companies"("Id");
ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_Companies_SupportDistributorCompanyId" FOREIGN KEY ("SupportDistributorCompanyId") REFERENCES "Companies"("Id") ON DELETE RESTRICT;
ALTER TABLE "Companies" ADD CONSTRAINT "FK_Companies_Users_CreatedById" FOREIGN KEY ("CreatedById") REFERENCES "Users"("Id") ON DELETE RESTRICT;
ALTER TABLE "Companies" ADD CONSTRAINT "FK_Companies_Users_UpdatedById" FOREIGN KEY ("UpdatedById") REFERENCES "Users"("Id") ON DELETE RESTRICT;
ALTER TABLE "Companies" ADD CONSTRAINT "FK_Companies_Companies_DistributorCompanyId" FOREIGN KEY ("DistributorCompanyId") REFERENCES "Companies"("Id") ON DELETE RESTRICT;
ALTER TABLE "Softwares" ADD CONSTRAINT "FK_Softwares_Users_CreatedById" FOREIGN KEY ("CreatedById") REFERENCES "Users"("Id") ON DELETE RESTRICT;
ALTER TABLE "Softwares" ADD CONSTRAINT "FK_Softwares_Users_UpdatedById" FOREIGN KEY ("UpdatedById") REFERENCES "Users"("Id") ON DELETE RESTRICT;
ALTER TABLE "Modules" ADD CONSTRAINT "FK_Modules_Users_CreatedById" FOREIGN KEY ("CreatedById") REFERENCES "Users"("Id") ON DELETE RESTRICT;
ALTER TABLE "Modules" ADD CONSTRAINT "FK_Modules_Users_UpdatedById" FOREIGN KEY ("UpdatedById") REFERENCES "Users"("Id") ON DELETE RESTRICT;

CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId"    varchar(150) NOT NULL,
    "ProductVersion" varchar(32)  NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

-- ── Seed data ─────────────────────────────────────────────────────────────────

-- Individual user (no company)
INSERT INTO "Users" ("Id", "Email", "CompanyAdmin", "CreatedAt", "UpdatedAt")
VALUES ('619bc5c0-6081-70ff-5a62-fcec8d5c1bba', 'demo@qsarflex.test', false, NOW(), NOW());

-- Demo company
INSERT INTO "Companies" ("Id", "Name", "IsDistributor", "CreatedAt", "UpdatedAt")
VALUES ('bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', 'Demo Corp', true, NOW(), NOW());

-- Enterprise admin user (in company, CompanyAdmin=true)
INSERT INTO "Users" ("Id", "Email", "CompanyId", "CompanyAdmin", "CreatedAt", "UpdatedAt")
VALUES ('41dbb5b0-70f1-7046-5c01-7bc9cc86cb83', 'demo-enterprise@qsarflex.test',
        'bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', true, NOW(), NOW());

-- 5 additional enterprise team members (for display in assigned users table)
INSERT INTO "Users" ("Id", "Email", "CompanyId", "CompanyAdmin", "CreatedAt", "UpdatedAt") VALUES
  ('ffff0001-0000-0000-0000-000000000000', 'alice.johnson@democorp.com',   'bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', false, NOW(), NOW()),
  ('ffff0002-0000-0000-0000-000000000000', 'bob.smith@democorp.com',       'bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', false, NOW(), NOW()),
  ('ffff0003-0000-0000-0000-000000000000', 'carol.white@democorp.com',     'bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', false, NOW(), NOW()),
  ('ffff0004-0000-0000-0000-000000000000', 'david.lee@democorp.com',       'bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', false, NOW(), NOW()),
  ('ffff0005-0000-0000-0000-000000000000', 'emily.chen@democorp.com',      'bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', false, NOW(), NOW());

-- QSARFlex software (UUID must match SOFTWARE_ID in qsarflex-be)
INSERT INTO "Softwares" ("Id", "Name", "CreatedAt", "UpdatedAt")
VALUES ('65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'QSARFlex', NOW(), NOW());

-- ── Individual licenses (owned by demo@qsarflex.test) ────────────────────────

-- L1: Individual Subscription (default active)
INSERT INTO "Licenses" ("Id", "SoftwareId", "Type", "Coverage", "Status", "OnDemand", "AllModulesSelected",
    "UserId", "StartDate", "EndDate", "ActivatedById", "ActivatedTime", "CreatedAt", "UpdatedAt")
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '65d6db1c-e3d3-4af3-8848-cc5fddab2eda',
    'Subscription', 'Individual', 'Active', false, true,
    '619bc5c0-6081-70ff-5a62-fcec8d5c1bba',
    '2026-01-01 00:00:00+00', '2027-12-31 23:59:59+00',
    '619bc5c0-6081-70ff-5a62-fcec8d5c1bba', NOW(),
    NOW(), NOW()
);

-- L2: Individual Pay-per-test
INSERT INTO "Licenses" ("Id", "SoftwareId", "Type", "Coverage", "Status", "OnDemand", "AllModulesSelected",
    "UserId", "TotalTests", "RemainingTests", "CreatedAt", "UpdatedAt")
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '65d6db1c-e3d3-4af3-8848-cc5fddab2eda',
    'PayPerTest', 'Individual', 'Inactive', false, true,
    '619bc5c0-6081-70ff-5a62-fcec8d5c1bba',
    100, 67, NOW(), NOW()
);

-- L3: Individual On-demand
INSERT INTO "Licenses" ("Id", "SoftwareId", "Type", "Coverage", "Status", "OnDemand", "AllModulesSelected",
    "UserId", "CreatedAt", "UpdatedAt")
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '65d6db1c-e3d3-4af3-8848-cc5fddab2eda',
    'Subscription', 'Individual', 'Inactive', true, true,
    '619bc5c0-6081-70ff-5a62-fcec8d5c1bba',
    NOW(), NOW()
);

-- ── Enterprise licenses (owned by Demo Corp) ──────────────────────────────────

-- L4: Enterprise Subscription
INSERT INTO "Licenses" ("Id", "SoftwareId", "Type", "Coverage", "Status", "OnDemand", "AllModulesSelected",
    "CompanyId", "NumberOfUsers", "StartDate", "EndDate", "ActivatedById", "ActivatedTime", "CreatedAt", "UpdatedAt")
VALUES (
    '44444444-4444-4444-4444-444444444444',
    '65d6db1c-e3d3-4af3-8848-cc5fddab2eda',
    'Subscription', 'Enterprise', 'Inactive', false, true,
    'bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', 5,
    '2026-01-01 00:00:00+00', '2027-12-31 23:59:59+00',
    NULL, NULL, NOW(), NOW()
);

-- L5: Enterprise Pay-per-test
INSERT INTO "Licenses" ("Id", "SoftwareId", "Type", "Coverage", "Status", "OnDemand", "AllModulesSelected",
    "CompanyId", "NumberOfUsers", "TotalTests", "RemainingTests", "CreatedAt", "UpdatedAt")
VALUES (
    '55555555-5555-5555-5555-555555555555',
    '65d6db1c-e3d3-4af3-8848-cc5fddab2eda',
    'PayPerTest', 'Enterprise', 'Inactive', false, true,
    'bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', 5,
    500, 342, NOW(), NOW()
);

-- L6: Enterprise On-demand
INSERT INTO "Licenses" ("Id", "SoftwareId", "Type", "Coverage", "Status", "OnDemand", "AllModulesSelected",
    "CompanyId", "NumberOfUsers", "CreatedAt", "UpdatedAt")
VALUES (
    '66666666-6666-6666-6666-666666666666',
    '65d6db1c-e3d3-4af3-8848-cc5fddab2eda',
    'Subscription', 'Enterprise', 'Inactive', true, true,
    'bbbbbbbb-bbbb-0000-0000-bbbbbbbbbbbb', 5,
    NOW(), NOW()
);

-- ── Bundles ───────────────────────────────────────────────────────────────────

INSERT INTO "Bundles" ("Id", "Name", "SoftwareId", "CreatedAt", "UpdatedAt") VALUES
  ('bd000001-0000-0000-0000-000000000000', 'Nitrosamine',      '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', NOW(), NOW()),
  ('bd000002-0000-0000-0000-000000000000', 'Ecotoxicity',      '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', NOW(), NOW()),
  ('bd000003-0000-0000-0000-000000000000', 'Physicochemical',  '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', NOW(), NOW()),
  ('bd000004-0000-0000-0000-000000000000', 'Genotoxicity',     '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', NOW(), NOW()),
  ('bd000005-0000-0000-0000-000000000000', 'ADME',             '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', NOW(), NOW());

-- ── Modules (names must match FilterModels filenames, case-insensitive) ────────

INSERT INTO "Modules" ("Id", "Name", "SoftwareId", "BundleId", "Coverage", "CreatedAt", "UpdatedAt") VALUES
  -- Nitrosamine
  ('0d000001-0000-0000-0000-000000000000', 'N-Nitrosation',          '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000001-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000002-0000-0000-0000-000000000000', 'CPCA Prediction',        '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000001-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000003-0000-0000-0000-000000000000', 'Surrogate Search',       '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000001-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000004-0000-0000-0000-000000000000', 'Cross Similarity',       '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000001-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  -- Ecotoxicity
  ('0d000005-0000-0000-0000-000000000000', 'Bio Concentration Factor','65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000002-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000006-0000-0000-0000-000000000000', 'Daphnia 48h LC50',       '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000002-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000007-0000-0000-0000-000000000000', 'Algae 72h EC50',         '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000002-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000008-0000-0000-0000-000000000000', 'Fathead Minnow 96h LC50','65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000002-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000009-0000-0000-0000-000000000000', 'Ready Biodegradability', '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000002-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000010-0000-0000-0000-000000000000', 'Tetrahymena 48h GC50',   '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000002-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000011-0000-0000-0000-000000000000', 'Soil Adsorption',        '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000002-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  -- Physicochemical
  ('0d000012-0000-0000-0000-000000000000', 'Boiling Point',          '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000003-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000013-0000-0000-0000-000000000000', 'Vapor Pressure',         '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000003-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000014-0000-0000-0000-000000000000', 'LogP',                   '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000003-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  ('0d000015-0000-0000-0000-000000000000', 'Water Solubility',       '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000003-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  -- Genotoxicity (filter filename has typo: "Mutagencity")
  ('0d000016-0000-0000-0000-000000000000', 'Ames Mutagencity',       '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000004-0000-0000-0000-000000000000', 0, NOW(), NOW()),
  -- ADME
  ('0d000017-0000-0000-0000-000000000000', 'Oral Bioavailability',   '65d6db1c-e3d3-4af3-8848-cc5fddab2eda', 'bd000005-0000-0000-0000-000000000000', 0, NOW(), NOW());

-- ── License modules (all licenses get all modules) ────────────────────────────

INSERT INTO "LicenseModules" ("LicenseId", "ModuleId", "CreatedAt", "UpdatedAt")
SELECT l."Id", m."Id", NOW(), NOW()
FROM "Licenses" l
CROSS JOIN "Modules" m
WHERE l."SoftwareId" = '65d6db1c-e3d3-4af3-8848-cc5fddab2eda';

-- ── Enterprise license members ────────────────────────────────────────────────

INSERT INTO "LicenseUsers" ("LicenseId", "UserId", "CreatedAt", "UpdatedAt") VALUES
  ('44444444-4444-4444-4444-444444444444', '41dbb5b0-70f1-7046-5c01-7bc9cc86cb83', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'ffff0001-0000-0000-0000-000000000000', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'ffff0002-0000-0000-0000-000000000000', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'ffff0003-0000-0000-0000-000000000000', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'ffff0004-0000-0000-0000-000000000000', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'ffff0005-0000-0000-0000-000000000000', NOW(), NOW()),

  ('55555555-5555-5555-5555-555555555555', '41dbb5b0-70f1-7046-5c01-7bc9cc86cb83', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'ffff0001-0000-0000-0000-000000000000', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'ffff0002-0000-0000-0000-000000000000', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'ffff0003-0000-0000-0000-000000000000', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'ffff0004-0000-0000-0000-000000000000', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'ffff0005-0000-0000-0000-000000000000', NOW(), NOW()),

  ('66666666-6666-6666-6666-666666666666', '41dbb5b0-70f1-7046-5c01-7bc9cc86cb83', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'ffff0001-0000-0000-0000-000000000000', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'ffff0002-0000-0000-0000-000000000000', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'ffff0003-0000-0000-0000-000000000000', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'ffff0004-0000-0000-0000-000000000000', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'ffff0005-0000-0000-0000-000000000000', NOW(), NOW());
