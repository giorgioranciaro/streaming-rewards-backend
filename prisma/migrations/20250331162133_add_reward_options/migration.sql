-- CreateTable
CREATE TABLE "RewardOption" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "requiredStreams" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RewardOption" ADD CONSTRAINT "RewardOption_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
