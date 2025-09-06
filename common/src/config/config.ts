import dotenv from "dotenv";

dotenv.config();

// Mail Settings
const SMTP_HOST = process.env.SMTP_HOST || "mail.smtp.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 2525;
const MAIL_USER = process.env.MAIL_USER || "example@example.com";
const MAIL_PASS = process.env.MAIL_PASS || "<PASSWORD>";
const MAIL_FROM = process.env.MAIL_FROM || "'Notification' <example@example.com>";

const MAIL = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  user: MAIL_USER,
  pass: MAIL_PASS,
  from: MAIL_FROM,
};

// AWS Settings (example: add what you need)
const AWS = {
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  s3Bucket: process.env.AWS_S3_BUCKET || "",
};

// Environment Config
const NODE_ENV = process.env.NODE_ENV || "local";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "<COOKIE_SECRET>";
const LOG_LEVEL = process.env.LOG_LEVEL || "debug";

const ENV = {
  nodeEnv: NODE_ENV,
  cookieSecret: COOKIE_SECRET,
  logLevel: LOG_LEVEL,
};

// Centralized config export
const config = {
  mail: MAIL,
  aws: AWS,
  env: ENV,
};

export default config;