import express from "express";
import { PrismaClient } from "@repo/db";
import { TRIGGER_WEBHOOK_ID } from "@repo/common/lib/config";

const PORT = 3001;
const app = express();
const prisma = new PrismaClient();

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

  if (zap.trigger?.availableTriggerId !== TRIGGER_WEBHOOK_ID)
    return res.json({ msg: "Trigger is not a webhook for this zap." });

  // Update database
  const zapRun = await prisma.$transaction(async (tx) => {
    const zapRun = await tx.zapRun.create({
      data: {
        zapId: zapId,
        status: "Processing",
        metaData: metadata,
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
