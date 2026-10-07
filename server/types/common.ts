import * as z from "zod";

// Mongo ObjectIds arrive as 24 character hex strings. Casting an invalid one
// throws inside the controller, so reject it up front instead.
export const objectId = z.string().regex(/^[0-9a-f]{24}$/i, "Invalid id");
