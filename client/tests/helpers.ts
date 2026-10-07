import { Ticket } from "@/core/types/models";
import { APIRequestContext, APIResponse, Page } from "@playwright/test";

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

// Live events are missed if they fire before the page's socket connects
export async function gotoWithSocket(page: Page, url: string) {
  const connected = page
    .waitForEvent("websocket", (ws) => ws.url().includes("socket.io"))
    .then((ws) =>
      // "40" is socket.io's connect acknowledgement, sent once rooms are joined
      ws.waitForEvent("framereceived", (frame) =>
        frame.payload.toString().startsWith("40"),
      ),
    );
  await page.goto(url);
  await connected;
}
