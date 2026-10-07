import { Comment, NotificationType, Ticket } from "@/core/types/models";
import { expect, APIResponse, Page } from "@playwright/test";
import { test } from "../fixtures";
import { gotoWithSocket, postTicket } from "../helpers";

async function openTicketDetails(page: Page, ticket: Ticket) {
  await page.locator("#ticket-title-" + ticket._id).click();
  const details = page.locator("#ticket-details");
  await expect(details.getByRole("heading", { level: 2 })).toHaveText(
    ticket.title,
  );
  return details;
}

test.describe("ticket tests", () => {
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

  test("assign a member to a ticket", async ({
    page,
    request,
    sharedProjectId,
    otherUser,
    otherPage,
  }) => {
    const response = await postTicket(request, sharedProjectId);
    expect(response.ok()).toBeTruthy();
    const { ticket } = await response.json();

    await page.goto("/project/" + sharedProjectId);
    await gotoWithSocket(otherPage, "/dashboard");

    // Open the assign modal from the row options
    const row = page.locator("li#ticket-row-" + ticket._id);
    await row
      .getByRole("button", { name: `Ticket options for ${ticket.title}` })
      .click();
    await row
      .getByRole("button", { name: `Assign members to ${ticket.title}` })
      .click();

    // Pick the other member and assign
    const modal = page.locator("#assign-ticket-modal-" + ticket._id);
    await modal
      .getByLabel("Search members to assign")
      .fill(otherUser.details.email.split("@")[0]);
    await modal
      .getByRole("checkbox", {
        name: "assign " + otherUser.details.email + " to ticket",
      })
      .check();
    await modal.getByRole("button", { name: "Confirm Assign" }).click();
    await expect(page.getByText("Members assigned successfully")).toBeVisible();

    // The assignee is notified live
    await otherPage.getByRole("button", { name: "Open Notifications" }).click();
    await expect(
      otherPage.locator(`#${NotificationType.TICKET_ASSIGN}_${ticket._id}`),
    ).toBeVisible();

    // Confirm assignment
    const getAfterAssignResponse = (await request.get(
      "/api/tickets/" + ticket._id,
    )) as APIResponse<{ ticket: Ticket }>;
    expect(getAfterAssignResponse.ok()).toBeTruthy();
    const body = await getAfterAssignResponse.json();
    expect(body.ticket.team.map((member) => member._id)).toContain(
      otherUser.details._id,
    );
  });

  test("members send and receive comments live", async ({
    page,
    request,
    sharedProjectId,
    otherUser,
    otherPage,
  }) => {
    const response = await postTicket(request, sharedProjectId);
    expect(response.ok()).toBeTruthy();
    const { ticket } = await response.json();
    // Only ticket members can comment, so add the other user to the team
    const assignResponse = await request.put("/api/tickets/" + ticket._id, {
      data: { team: [otherUser.details._id] },
    });
    expect(assignResponse.ok()).toBeTruthy();

    await gotoWithSocket(page, "/project/" + sharedProjectId);
    await gotoWithSocket(otherPage, "/project/" + sharedProjectId);
    const details = await openTicketDetails(page, ticket);
    const otherDetails = await openTicketDetails(otherPage, ticket);

    // Author sends, member receives
    const comment = "comment " + Date.now();
    await details.getByLabel("Comment").fill(comment);
    await details.getByLabel("Comment").press("Enter");
    await expect(details.getByText(comment)).toBeVisible();
    await expect(details.getByLabel("Comment")).toHaveValue("");
    await expect(otherDetails.getByText(comment)).toBeVisible();

    // Member replies, author receives
    const reply = "reply " + Date.now();
    await otherDetails.getByLabel("Comment").fill(reply);
    await otherDetails.getByLabel("Comment").press("Enter");
    await expect(otherDetails.getByText(reply)).toBeVisible();
    await expect(details.getByText(reply)).toBeVisible();

    // Confirm both comments were saved
    const getAfterCommentResponse = (await request.get(
      "/api/tickets/" + ticket._id,
    )) as APIResponse<{ ticket: Ticket }>;
    expect(getAfterCommentResponse.ok()).toBeTruthy();
    const body = await getAfterCommentResponse.json();
    const comments = body.ticket.comments as Comment[];
    expect(comments.map((c) => c.text)).toEqual([comment, reply]);
  });
});
