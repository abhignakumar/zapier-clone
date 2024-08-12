import express from "express";
import { PrismaClient } from "@repo/db";

const PORT = 3001;
const app = express();
const prisma = new PrismaClient();
const WEBHOOK_TRIGGER_ID = "2e8adadc-034c-4d0c-a722-05a51e3c48f0";

app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const metadata = req.body || null;

  // Validations
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return res.json({ msg: "User not found." });

  const zap = await prisma.zap.findUnique({
    where: {
      id: zapId,
    },
    include: {
      trigger: true,
    },
  });

  if (!zap) return res.json({ msg: "Zap not found." });

  if (zap.trigger?.availableTriggerId !== WEBHOOK_TRIGGER_ID)
    return res.json({ msg: "Trigger is not a webhook for this zap." });

  // Update database
  const zapRun = await prisma.$transaction(async (tx) => {
    const zapRun = await tx.zapRun.create({
      data: {
        zapId: zapId,
        status: "Processing",
        metadata: metadata,
      },
    });
    await tx.zapRunOutBox.create({
      data: {
        zapId: zapId,
        zapRunId: zapRun.id,
      },
    });
    return zapRun;
  });

  if (zapRun) return res.json({ msg: "Zap has started processing." });
  else res.json({ msg: "ZapRun error." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ...`);
});
