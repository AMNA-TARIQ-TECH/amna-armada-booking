import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model.js";
import { env } from "../../config/env.js";
import { AppError } from "../../common/utils/AppError.js";

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl || null,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function registerUser({ name, email, password, avatarUrl }) {
  if (!name?.trim() || !email?.trim() || !password) {
    throw new AppError("Name, email and password are required", 400);
  }
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new AppError("Email already registered", 409);

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hash,
    avatarUrl:
      avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
  });

  return { user: publicUser(user), token: signToken(user) };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email?.toLowerCase() }).select(
    "+password"
  );
  if (!user) throw new AppError("Invalid email or password", 401);

  const valid = await bcrypt.compare(password || "", user.password);
  if (!valid) throw new AppError("Invalid email or password", 401);

  return { user: publicUser(user), token: signToken(user) };
}

export async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return publicUser(user);
}
