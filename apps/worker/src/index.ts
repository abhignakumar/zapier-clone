import { Kafka } from "kafkajs";
import { KAFKA_TOPIC_NAME } from "@repo/common/lib/config";

const kafka = new Kafka({
  clientId: "worker",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "main-worker" });

async function main() {
  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPIC_NAME, fromBeginning: true });
  console.log("Worker is running ...");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
      await new Promise((r) => setTimeout(r, 3000));
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
