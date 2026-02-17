-- CreateTable
CREATE TABLE "AIAssessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "questions" JSONB NOT NULL,
    "userAnswers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIAssessment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIAssessment" ADD CONSTRAINT "AIAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
