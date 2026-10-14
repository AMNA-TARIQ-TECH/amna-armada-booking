import cron from "node-cron";
import { Booking } from "../modules/bookings/booking.model.js";
import { getReminderHours } from "../modules/settings/settings.service.js";
import { log } from "../common/utils/logger.js";

export function startReminderJob() {
  cron.schedule("*/15 * * * *", async () => {
    try {
      const hours = await getReminderHours();
      const now = new Date();
      const until = new Date(now.getTime() + hours * 60 * 60 * 1000);

      const upcoming = await Booking.find({
        status: { $in: ["pending", "confirmed"] },
        date: { $gte: now, $lte: until },
      }).populate({
        path: "serviceId",
        select: "title userId",
        populate: { path: "userId", select: "name email" },
      });

      if (upcoming.length === 0) {
        log.info(`Reminder: no bookings in next ${hours}h`);
        return;
      }

      for (const booking of upcoming) {
        const service = booking.serviceId;
        log.warn(
          `Reminder: ${booking.clientName} → "${service?.title}" at ${booking.date.toLocaleString()}`
        );
      }
    } catch (error) {
      log.error(`Reminder job failed: ${error.message}`);
    }
  });

  log.success("Reminder cron ready (every 15 min)");
}
