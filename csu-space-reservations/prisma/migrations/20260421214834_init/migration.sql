-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'SUBMITTER',
    "department" TEXT,
    "title" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "building" TEXT,
    "capacity" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestorName" TEXT NOT NULL,
    "title" TEXT,
    "department" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "telephone" TEXT,
    "fax" TEXT,
    "email" TEXT NOT NULL,
    "fundingAccountNo" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "alternativeDate" DATETIME,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "attendance" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "speakerPerformer" TEXT,
    "whoMayAttend" TEXT,
    "admissionType" TEXT,
    "ticketPrice" REAL,
    "payOnSitePrice" REAL,
    "foodBeverages" BOOLEAN NOT NULL DEFAULT false,
    "musicProvided" BOOLEAN NOT NULL DEFAULT false,
    "musicType" TEXT,
    "concessionsNeeded" BOOLEAN NOT NULL DEFAULT false,
    "catered" BOOLEAN NOT NULL DEFAULT false,
    "webCalendar" BOOLEAN NOT NULL DEFAULT false,
    "requestedSpace" TEXT NOT NULL,
    "roomId" TEXT,
    "setupDescription" TEXT,
    "doorOpenTimeSponsor" TEXT,
    "doorOpenTimePublic" TEXT,
    "soundMicrophone" BOOLEAN NOT NULL DEFAULT false,
    "audiovisual" BOOLEAN NOT NULL DEFAULT false,
    "podium" BOOLEAN NOT NULL DEFAULT false,
    "stage" BOOLEAN NOT NULL DEFAULT false,
    "stageSize" TEXT,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "telecomDevices" BOOLEAN NOT NULL DEFAULT false,
    "tablesNeeded" BOOLEAN NOT NULL DEFAULT false,
    "tableType" TEXT,
    "registrationTable" BOOLEAN NOT NULL DEFAULT false,
    "chairs" BOOLEAN NOT NULL DEFAULT false,
    "chairCount" INTEGER,
    "lighting" BOOLEAN NOT NULL DEFAULT false,
    "pipeDrape" BOOLEAN NOT NULL DEFAULT false,
    "otherServices" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submitterType" TEXT NOT NULL,
    "denialReason" TEXT,
    "submittedById" TEXT NOT NULL,
    "advisorId" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Reservation_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ApprovalAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApprovalAction_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ApprovalAction_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Reservation_eventDate_idx" ON "Reservation"("eventDate");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");

-- CreateIndex
CREATE INDEX "Reservation_submittedById_idx" ON "Reservation"("submittedById");
