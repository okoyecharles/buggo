import * as z from "zod";
import { objectId } from "./common";

// The values the client actually sends. The comment at the top of
// ticketModel.ts lists an older, capitalised set that nothing uses.
export const ticketStatus = z.enum(["open", "closed"]);
export const ticketPriority = z.enum(["low", "medium", "high"]);
export const ticketType = z.enum(["issue", "feature", "bug", "other"]);

const title = z.string().trim().min(5).max(50);
const description = z.string().trim().min(1).max(500);
// The create form keeps its number input's value as a string, so coerce
// rather than reject it.
const timeEstimate = z.coerce.number().positive();

export const createTicketSchema = z.object({
  title,
  description,
  status: ticketStatus,
  priority: ticketPriority,
  type: ticketType,
  time_estimate: timeEstimate,
});
export type CreateTicketBody = z.infer<typeof createTicketSchema>;

// Every field is a partial update: the controller hands the body straight to
// updateOne, which ignores the keys left undefined.
export const updateTicketSchema = z.object({
  title: title.optional(),
  description: description.optional(),
  status: ticketStatus.optional(),
  priority: ticketPriority.optional(),
  type: ticketType.optional(),
  time_estimate: timeEstimate.optional(),
  team: z.array(objectId).optional(),
  comments: z.array(objectId).optional(),
});
export type UpdateTicketBody = z.infer<typeof updateTicketSchema>;
