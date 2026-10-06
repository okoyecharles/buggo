import { Ticket } from "@/core/types/models";
import { APIRequestContext, APIResponse } from "@playwright/test";

export async function postTicket(req: APIRequestContext, projectId: string) {
  const ticketTitle = "ticket" + Date.now();
  const response = await req.post("/api/projects/" + projectId + "/tickets", {
    data: {
      priority: "medium",
      status: "open",
      type: "bug",
      time_estimate: 50,
      title: ticketTitle,
      description: "Desc",
    },
  });
  return response as APIResponse<{ ticket: Ticket }>;
}
