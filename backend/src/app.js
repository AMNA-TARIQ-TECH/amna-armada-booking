import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./common/middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import servicesRoutes from "./modules/services/services.routes.js";
import bookingsRoutes from "./modules/bookings/bookings.routes.js";
import settingsRoutes from "./modules/settings/settings.routes.js";

const app = express();

const allowedOrigins = env.frontendUrl
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // local Next.js ports during development
      if (
        env.nodeEnv !== "production" &&
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/settings", settingsRoutes);

app.use(errorHandler);

export default app;
