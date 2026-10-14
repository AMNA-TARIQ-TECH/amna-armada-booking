import { Booking } from "./booking.model.js";
import { Service } from "../services/service.model.js";
import { AppError } from "../../common/utils/AppError.js";

function serialize(booking) {
  const service = booking.serviceId;
  return {
    id: booking._id.toString(),
    serviceId:
      typeof service === "object" && service?._id
        ? service._id.toString()
        : booking.serviceId.toString(),
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    date: booking.date,
    status: booking.status,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    service:
      typeof service === "object" && service?._id
        ? {
            id: service._id.toString(),
            title: service.title,
            durationMinutes: service.durationMinutes,
            isActive: service.isActive,
          }
        : undefined,
  };
}

async function ownedServiceIds(userId) {
  const services = await Service.find({ userId }).select("_id");
  return services.map((s) => s._id);
}

export async function listBookings(userId, status = "all") {
  const serviceIds = await ownedServiceIds(userId);
  const filter = { serviceId: { $in: serviceIds } };
  if (status !== "all") filter.status = status;

  const bookings = await Booking.find(filter)
    .populate("serviceId", "title durationMinutes isActive")
    .sort({ date: 1 });

  return bookings.map(serialize);
}

export async function getBooking(userId, id) {
  const serviceIds = await ownedServiceIds(userId);
  const booking = await Booking.findOne({
    _id: id,
    serviceId: { $in: serviceIds },
  }).populate("serviceId", "title durationMinutes isActive");

  if (!booking) throw new AppError("Booking not found", 404);
  return serialize(booking);
}

export async function createBooking(userId, body) {
  const { serviceId, clientName, clientEmail, date, status } = body;

  if (!serviceId || !clientName?.trim() || !clientEmail?.trim() || !date) {
    throw new AppError(
      "serviceId, clientName, clientEmail and date are required",
      400
    );
  }

  const service = await Service.findOne({ _id: serviceId, userId });
  if (!service) throw new AppError("Service not found", 404);

  const booking = await Booking.create({
    serviceId,
    clientName: clientName.trim(),
    clientEmail: clientEmail.toLowerCase().trim(),
    date: new Date(date),
    status: status || "pending",
  });

  await booking.populate("serviceId", "title durationMinutes isActive");
  return serialize(booking);
}

export async function updateBookingStatus(userId, id, status) {
  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const serviceIds = await ownedServiceIds(userId);
  const booking = await Booking.findOne({
    _id: id,
    serviceId: { $in: serviceIds },
  });
  if (!booking) throw new AppError("Booking not found", 404);

  booking.status = status;
  await booking.save();
  await booking.populate("serviceId", "title durationMinutes isActive");
  return serialize(booking);
}

export async function updateBooking(userId, id, body) {
  const serviceIds = await ownedServiceIds(userId);
  const booking = await Booking.findOne({
    _id: id,
    serviceId: { $in: serviceIds },
  });
  if (!booking) throw new AppError("Booking not found", 404);

  if (body.serviceId) {
    const service = await Service.findOne({ _id: body.serviceId, userId });
    if (!service) throw new AppError("Service not found", 404);
    booking.serviceId = body.serviceId;
  }
  if (body.clientName !== undefined) {
    if (!body.clientName.trim()) throw new AppError("Client name is required", 400);
    booking.clientName = body.clientName.trim();
  }
  if (body.clientEmail !== undefined) {
    if (!body.clientEmail.trim()) throw new AppError("Client email is required", 400);
    booking.clientEmail = body.clientEmail.toLowerCase().trim();
  }
  if (body.date !== undefined) booking.date = new Date(body.date);
  if (body.status !== undefined) {
    if (!["pending", "confirmed", "cancelled"].includes(body.status)) {
      throw new AppError("Invalid status", 400);
    }
    booking.status = body.status;
  }

  await booking.save();
  await booking.populate("serviceId", "title durationMinutes isActive");
  return serialize(booking);
}

export async function deleteBooking(userId, id) {
  const serviceIds = await ownedServiceIds(userId);
  const booking = await Booking.findOneAndDelete({
    _id: id,
    serviceId: { $in: serviceIds },
  });
  if (!booking) throw new AppError("Booking not found", 404);
  return { id };
}
