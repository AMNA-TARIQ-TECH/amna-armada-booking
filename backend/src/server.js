import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { startReminderJob } from "./jobs/reminderJob.js";
import { log } from "./common/utils/logger.js";

async function bootstrap() {
  await connectDB();

  app.listen(env.port, () => {
    log.server({ port: env.port, env: env.nodeEnv });
    startReminderJob();
  });
}

bootstrap().catch((err) => {
  if (err?.message !== "DB_CONNECTION_FAILED") {
    log.error(err?.message || "Failed to start server");
  }
  process.exit(1);
});
