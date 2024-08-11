import { PrismaClient } from "@repo/db";
import { Kafka } from "kafkajs";
import { KAFKA_TOPIC_NAME } from "@repo/common/lib/config";

const prisma = new PrismaClient();
const kafka = new Kafka({
  clientId: "outbox-sweeper",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

async function main() {
  await producer.connect();
  console.log("Outbox Sweeper is running ...");
  while (1) {
    const pendingZapRuns = await prisma.zapRunOutBox.findMany({
      take: 10,
    });

    await producer.send({
      topic: KAFKA_TOPIC_NAME,
      messages: pendingZapRuns.map((z) => ({ value: z.zapRunId })),
    });

    await prisma.zapRunOutBox.deleteMany({
      where: {
        id: {
          in: pendingZapRuns.map((z) => z.id),
        },
      },
    });

    await new Promise((r) => setTimeout(r, 5000));
  }
}

main();
