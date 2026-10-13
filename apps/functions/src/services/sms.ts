import twilio from "twilio";
import { loadEnv } from "../lib/envs";

const client = twilio(
  loadEnv("TWILIO_ACCOUNT_SID"),
  loadEnv("TWILIO_AUTH_TOKEN")
);

export interface SendSmsOptions {
  to: string;
  body: string;
}

export async function sendSms(options: SendSmsOptions): Promise<void> {
  await client.messages.create({
    to: options.to,
    from: loadEnv("TWILIO_FROM_NUMBER"),
    body: options.body,
  });
}

