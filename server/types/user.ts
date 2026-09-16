import * as z from "zod";

const name = z.string().trim().min(2).max(50);
const image = z.string().min(1);
const email = z.email().max(50);
const password = z.string().min(6);

export const registerSchema = z.object({
  name,
  email,
  // The client sends either a base64 data URI or a URL to a default avatar.
  image,
  password,
});
export type RegisterBody = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email,
  // Not the register rules: an existing password only has to be present.
  password: z.string().min(1),
});
export type LoginBody = z.infer<typeof loginSchema>;

// Only name and image are writable, and only when truthy.
export const updateUserSchema = z.object({
  name: name.optional(),
  image: image.optional(),
});
export type UpdateUserBody = z.infer<typeof updateUserSchema>;
