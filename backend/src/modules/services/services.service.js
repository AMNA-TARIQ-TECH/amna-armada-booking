import { Service } from "./service.model.js";
import { AppError } from "../../common/utils/AppError.js";

function serialize(service) {
  return {
    id: service._id.toString(),
    userId: service.userId.toString(),
    title: service.title,
    description: service.description || "",
    durationMinutes: service.durationMinutes,
    isActive: service.isActive,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

export async function listServices(userId, status = "all") {
  const filter = { userId };
  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;

  const services = await Service.find(filter).sort({ createdAt: -1 });
  return services.map(serialize);
}

export async function getService(userId, id) {
  const service = await Service.findOne({ _id: id, userId });
  if (!service) throw new AppError("Service not found", 404);
  return serialize(service);
}

export async function createService(userId, body) {
  if (!body.title?.trim()) throw new AppError("Title is required", 400);

  const service = await Service.create({
    userId,
    title: body.title.trim(),
    description: body.description || "",
    durationMinutes: Number(body.durationMinutes) || 30,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
  });

  return serialize(service);
}

export async function updateService(userId, id, body) {
  const service = await Service.findOne({ _id: id, userId });
  if (!service) throw new AppError("Service not found", 404);

  if (body.title !== undefined) {
    if (!body.title.trim()) throw new AppError("Title is required", 400);
    service.title = body.title.trim();
  }
  if (body.description !== undefined) service.description = body.description;
  if (body.durationMinutes !== undefined) {
    service.durationMinutes = Number(body.durationMinutes);
  }
  if (body.isActive !== undefined) service.isActive = Boolean(body.isActive);

  await service.save();
  return serialize(service);
}

export async function deleteService(userId, id) {
  const service = await Service.findOneAndDelete({ _id: id, userId });
  if (!service) throw new AppError("Service not found", 404);
  return { id };
}
