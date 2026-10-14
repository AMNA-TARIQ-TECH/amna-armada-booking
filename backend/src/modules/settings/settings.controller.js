import * as settingsService from "./settings.service.js";
import { AppError } from "../../common/utils/AppError.js";

export async function getReminder(_req, res) {
  const reminderHours = await settingsService.getReminderHours();
  res.json({ success: true, data: { reminderHours } });
}

export async function updateReminder(req, res) {
  const hours = Number(req.body.reminderHours);
  if (!Number.isFinite(hours) || hours < 1 || hours > 168) {
    throw new AppError("reminderHours must be between 1 and 168", 400);
  }
  const reminderHours = await settingsService.setReminderHours(hours);
  res.json({ success: true, data: { reminderHours } });
}
