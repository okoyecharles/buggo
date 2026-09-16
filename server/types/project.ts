import * as z from "zod";
import { objectId } from "./common";

export const createProjectSchema = z.object({
  title: z.string().min(15),
})
export type CreateProjectBody = z.infer<typeof createProjectSchema>;

// Both fields are applied only when truthy by the controller, so a partial
// update is valid.
export const updateProjectSchema = z.object({
  title: z.string().min(1).max(25).optional(),
  team: z.array(objectId).optional(),
});
export type UpdateProjectBody = z.infer<typeof updateProjectSchema>;

export const inviteToProjectSchema = z.object({
  invitees: z
    .array(
      z.object({
        user: objectId,
        email: z.email(),
      }),
    )
    .min(1),
});
export type InviteToProjectBody = z.infer<typeof inviteToProjectSchema>;
