require("dotenv").config();

import { Kafka } from "kafkajs";
import { ACTION_EMAIL_ID, KAFKA_TOPIC_NAME } from "@repo/common/lib/config";
import { PrismaClient } from "@repo/db";
import { actionEmail } from "./actions/email";

const prisma = new PrismaClient();

const kafka = new Kafka({
  clientId: "worker",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "main-worker" });
const producer = kafka.producer();

async function main() {
  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPIC_NAME, fromBeginning: true });

  await producer.connect();

  console.log("Worker is running ...");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      if (!message.value?.toString()) {
        console.log("Message is invalid");
        return;
      }

      const parsedMessage = JSON.parse(message.value?.toString());

      const zapDetails = await prisma.zapRun.findUnique({
        where: {
          id: parsedMessage.zapRunId,
        },
        include: {
          zap: {
            include: {
              trigger: {
                include: {
                  type: true,
                },
              },
              actions: {
                include: {
                  type: true,
                },
              },
            },
          },
        },
      });

      const currentAction = zapDetails?.zap.actions.find(
        (a) => a.order === parsedMessage.stage
      );

      if (!currentAction) {
        console.log("Current action is invalid");
        console.log("Zap Run failed");

        await prisma.zapRun.update({
          where: {
            id: parsedMessage.zapRunId,
          },
          data: {
            status: "Failed",
          },
        });
        return;
      }

      console.log("Starting action ...");

      try {
        switch (currentAction?.type.id) {
          case ACTION_EMAIL_ID:
            await actionEmail(
              zapDetails?.metaData || {},
              currentAction.metaData
            );
            break;
        }
      } catch (e) {
        console.log("Error !!");
        console.log(e);
        console.log("Zap Run failed");

        await prisma.zapRun.update({
          where: {
            id: parsedMessage.zapRunId,
          },
          data: {
            status: "Failed",
          },
        });
        return;
      }

      console.log("Action finished");

      if (parsedMessage.stage < (zapDetails?.zap.actions.length || 1) - 1) {
        console.log("Publishing back to the queue");

        await producer.send({
          topic: KAFKA_TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({
                zapRunId: parsedMessage.zapRunId,
                stage: parsedMessage.stage + 1,
              }),
            },
          ],
        });
      } else {
        console.log("Zap completely executed");
        await prisma.zapRun.update({
          where: {
            id: parsedMessage.zapRunId,
          },
          data: {
            status: "Completed",
          },
        });
      }

      await consumer.commitOffsets([
        {
          topic: topic,
          partition: partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}

main();
