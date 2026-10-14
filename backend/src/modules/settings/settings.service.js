import { Setting } from "./setting.model.js";

const REMINDER_KEY = "reminder_hours";

export async function getReminderHours() {
  const setting = await Setting.findOne({ key: REMINDER_KEY });
  const value = Number(setting?.value ?? 24);
  return Number.isFinite(value) && value > 0 ? value : 24;
}

export async function setReminderHours(hours) {
  const setting = await Setting.findOneAndUpdate(
    { key: REMINDER_KEY },
    { value: String(hours) },
    { upsert: true, new: true }
  );
  return Number(setting.value);
}
