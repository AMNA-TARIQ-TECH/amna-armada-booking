import * as bookingsService from "./bookings.service.js";

export async function list(req, res) {
  const status = req.query.status || "all";
  const data = await bookingsService.listBookings(req.user.id, status);
  res.json({ success: true, data });
}

export async function getOne(req, res) {
  const data = await bookingsService.getBooking(req.user.id, req.params.id);
  res.json({ success: true, data });
}

export async function create(req, res) {
  const data = await bookingsService.createBooking(req.user.id, req.body);
  res.status(201).json({ success: true, data });
}

export async function updateStatus(req, res) {
  const data = await bookingsService.updateBookingStatus(
    req.user.id,
    req.params.id,
    req.body.status
  );
  res.json({ success: true, data });
}

export async function update(req, res) {
  const data = await bookingsService.updateBooking(
    req.user.id,
    req.params.id,
    req.body
  );
  res.json({ success: true, data });
}

export async function remove(req, res) {
  const data = await bookingsService.deleteBooking(req.user.id, req.params.id);
  res.json({ success: true, data });
}
