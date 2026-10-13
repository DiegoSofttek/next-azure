import sgMail from "@sendgrid/mail";
import { loadEnv } from "../lib/envs";

sgMail.setApiKey(loadEnv("SENDGRID_API_KEY"));

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  await sgMail.send({
    to: options.to,
    from: loadEnv("SENDGRID_FROM_EMAIL"),
    subject: options.subject,
    html: options.html,
  });
}