import * as servicesService from "./services.service.js";

export async function list(req, res) {
  const status = req.query.status || "all";
  const data = await servicesService.listServices(req.user.id, status);
  res.json({ success: true, data });
}

export async function getOne(req, res) {
  const data = await servicesService.getService(req.user.id, req.params.id);
  res.json({ success: true, data });
}

export async function create(req, res) {
  const data = await servicesService.createService(req.user.id, req.body);
  res.status(201).json({ success: true, data });
}

export async function update(req, res) {
  const data = await servicesService.updateService(
    req.user.id,
    req.params.id,
    req.body
  );
  res.json({ success: true, data });
}

export async function remove(req, res) {
  const data = await servicesService.deleteService(req.user.id, req.params.id);
  res.json({ success: true, data });
}
