import { Ticket } from "@/core/types/models";
import { expect, APIRequestContext, APIResponse } from "@playwright/test";
import { test } from "../fixtures";

async function postTicket(req: APIRequestContext, projectId: string) {
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

test.describe("tickets", () => {
  test("create ticket", async ({ page, projectId }) => {
    await page.goto("/project/" + projectId);

    // Create Ticket through UI
    const ticketTitle = "ticket" + Date.now();
    await page
      .getByRole("button", { name: "Open Create Ticket Modal" })
      .click();
    await page.getByRole("textbox", { name: "Title" }).fill(ticketTitle);
    await page.getByRole("textbox", { name: "Description" }).fill("Desc");
    await page.getByLabel("Priority").selectOption("medium");
    await page.getByLabel("Type").selectOption("bug");
    await page
      .getByRole("spinbutton", { name: "Time estimate (in hours)" })
      .fill("50");
    await page.getByRole("button", { name: "Submit Ticket" }).click();

    // Confirm Creation
    await expect(
      page.getByRole("heading", { name: ticketTitle, exact: true }),
    ).toBeVisible();
  });

  test("edit ticket", async ({ page, request, projectId }) => {
    // create ticket through api
    const response = await postTicket(request, projectId);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    // Edit Ticket through UI
    await page.goto("/project/" + projectId);
    await expect(page.getByRole("main")).toContainText(body.ticket.title);
    const row = page.locator("li#ticket-row-" + body.ticket._id);
    await expect(row).toBeVisible();
    const optionsButton = row.getByRole("button", {
      name: `Ticket options for ${body.ticket.title}`,
    });
    await expect(optionsButton).toBeVisible();
    await optionsButton.click();
    const closeTicket = row.getByRole("button", { name: "Close Ticket" });
    await closeTicket.click();
    await expect(row.getByText("Closed")).toBeVisible();

    // Confirm Edit
    const getAfterEditResponse = (await request.get(
      "/api/tickets/" + body.ticket._id,
    )) as APIResponse<{ ticket: Ticket }>;
    expect(getAfterEditResponse.ok()).toBeTruthy();
    const { ticket } = await getAfterEditResponse.json();
    expect(ticket.status).toBe("closed");
  });

  test("delete ticket", async ({ page, request, projectId }) => {
    // create ticket through api
    const response = await postTicket(request, projectId);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    // Delete Ticket through UI
    await page.goto("/project/" + projectId);
    await expect(page.getByRole("main")).toContainText(body.ticket.title);
    const row = page.locator("li#ticket-row-" + body.ticket._id);
    await expect(row).toBeVisible();
    const optionsButton = row.getByRole("button", {
      name: `Ticket options for ${body.ticket.title}`,
    });
    await expect(optionsButton).toBeVisible();
    await optionsButton.click();
    const deleteTicket = row.getByRole("button", { name: "Delete Ticket" });
    await deleteTicket.click();

    // Confirm Deletion
    const confirmDeleteTicket = page.getByRole("button", {
      name: "Delete Ticket " + body.ticket.title,
    });
    await confirmDeleteTicket.click();
    await expect(row).not.toBeVisible();
    const getAfterDeleteResponse = await request.get(
      "/api/tickets/" + body.ticket._id,
    );
    expect(getAfterDeleteResponse.status()).toBe(404);
  });
});
