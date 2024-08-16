import { Prisma } from "@repo/db";
import { parseMetaData } from "../parser";
import sgMail from "@sendgrid/mail";

export async function actionEmail(
  zapRunMetaData: Prisma.JsonValue,
  actionMetaData: Prisma.JsonValue
) {
  const toEmail = parseMetaData(
    (actionMetaData as Prisma.JsonObject).to as string,
    zapRunMetaData
  );
  const bodyEmail = parseMetaData(
    (actionMetaData as Prisma.JsonObject).body as string,
    zapRunMetaData
  );
  await sendEmail(toEmail, bodyEmail);
}

async function sendEmail(toEmail: string, bodyEmail: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
  const msg = {
    to: toEmail,
    from: process.env.FROM_EMAIL_ID || "",
    subject: "Hello from Zapier Clone",
    text: bodyEmail,
  };
  console.log(msg);
  const response = await sgMail.send(msg);
  console.log(response);
  console.log("Email Sent");
}
