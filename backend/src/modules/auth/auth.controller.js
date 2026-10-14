import * as authService from "./auth.service.js";

export async function register(req, res) {
  const data = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data });
}

export async function login(req, res) {
  const data = await authService.loginUser(req.body);
  res.json({ success: true, data });
}

export async function me(req, res) {
  const data = await authService.getMe(req.user.id);
  res.json({ success: true, data });
}
