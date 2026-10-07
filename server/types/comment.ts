import * as z from "zod";

export const createCommentSchema = z.object({
  text: z.string().trim().min(1).max(500),
});
export type CreateCommentBody = z.infer<typeof createCommentSchema>;
