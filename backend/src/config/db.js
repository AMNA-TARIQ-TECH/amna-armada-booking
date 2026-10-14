import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import { env } from "./env.js";
import { log } from "../common/utils/logger.js";

export async function connectDB() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    log.success(`MongoDB connected  ${env.mongodbUri}`);
  } catch (err) {
    const reason =
      err?.cause?.message ||
      err?.message ||
      "Could not connect to MongoDB";

    log.error(`MongoDB connection failed`);
    log.warn(`Reason: ${reason.split("\n")[0]}`);
    log.warn(`Start MongoDB locally, or set MONGODB_URI in backend/.env`);
    log.info(`Example: brew services start mongodb-community`);
    log.info(`Or use Atlas: mongodb+srv://USER:PASS@cluster/...`);

    throw new Error("DB_CONNECTION_FAILED");
  }
}
