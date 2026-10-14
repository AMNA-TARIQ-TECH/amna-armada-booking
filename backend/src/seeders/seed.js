import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../modules/users/user.model.js";
import { Service } from "../modules/services/service.model.js";
import { Booking } from "../modules/bookings/booking.model.js";
import { Setting } from "../modules/settings/setting.model.js";

async function seed() {
  await connectDB();

  const email = "amna@example.com";
  let user = await User.findOne({ email });

  if (!user) {
    const password = await bcrypt.hash("password123", 10);
    user = await User.create({
      name: "Amna Tariq",
      email,
      password,
      avatarUrl:
        "https://ui-avatars.com/api/?name=Amna+Tariq&background=0D8ABC&color=fff",
    });
    console.log("Created demo user");
  }

  let services = await Service.find({ userId: user._id });
  if (services.length === 0) {
    services = await Service.insertMany([
      {
        userId: user._id,
        title: "Initial Consultation",
        description: "30-minute discovery call to understand client needs.",
        durationMinutes: 30,
        isActive: true,
      },
      {
        userId: user._id,
        title: "Strategy Session",
        description: "Deep-dive planning session for project roadmap.",
        durationMinutes: 60,
        isActive: true,
      },
      {
        userId: user._id,
        title: "Follow-up Review",
        description: "Review progress and adjust next steps.",
        durationMinutes: 45,
        isActive: true,
      },
      {
        userId: user._id,
        title: "Archived Workshop",
        description: "Older workshop offering (inactive).",
        durationMinutes: 90,
        isActive: false,
      },
    ]);
    console.log(`Created ${services.length} sample services`);
  }

  await Setting.findOneAndUpdate(
    { key: "reminder_hours" },
    { value: "24" },
    { upsert: true }
  );

  const bookingCount = await Booking.countDocuments();
  if (bookingCount === 0) {
    const active = services.filter((s) => s.isActive);
    const now = Date.now();
    await Booking.insertMany([
      {
        serviceId: active[0]._id,
        clientName: "Sara Khan",
        clientEmail: "sara@example.com",
        date: new Date(now + 2 * 60 * 60 * 1000),
        status: "pending",
      },
      {
        serviceId: (active[1] || active[0])._id,
        clientName: "Ali Raza",
        clientEmail: "ali@example.com",
        date: new Date(now + 26 * 60 * 60 * 1000),
        status: "confirmed",
      },
      {
        serviceId: active[0]._id,
        clientName: "Hina Malik",
        clientEmail: "hina@example.com",
        date: new Date(now - 24 * 60 * 60 * 1000),
        status: "cancelled",
      },
    ]);
    console.log("Created sample bookings");
  }

  console.log("Seed complete.");
  console.log("Demo login → email: amna@example.com | password: password123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
