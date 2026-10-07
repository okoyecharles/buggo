import { Ticket } from "@/core/types/models";
import { expect, APIResponse } from "@playwright/test";
import { test } from "../fixtures";
import { postTicket } from "../helpers";

const twoDigits = (count: number) => count.toString().padStart(2, "0");

test.describe("my ticket tests", () => {
  test("stats match the user's tickets", async ({
    sharedProjectId,
    request,
    otherRequest,
    otherPage,
  }) => {
    // The other user authors 2 open tickets and 1 closed one
    const ticketIds: string[] = [];
    for (let i = 0; i < 3; i++) {
      const response = await postTicket(otherRequest, sharedProjectId);
      expect(response.ok()).toBeTruthy();
      ticketIds.push((await response.json()).ticket._id);
    }
    const closeResponse = await otherRequest.put("/api/tickets/" + ticketIds[0], {
      data: { status: "closed" },
    });
    expect(closeResponse.ok()).toBeTruthy();
    // Tickets by someone else in the same project must not count
    expect((await postTicket(request, sharedProjectId)).ok()).toBeTruthy();

    // Expected numbers come from everything the user authored
    const ticketsResponse = (await otherRequest.get(
      "/api/tickets",
    )) as APIResponse<{ tickets: Ticket[] }>;
    expect(ticketsResponse.ok()).toBeTruthy();
    const { tickets } = await ticketsResponse.json();
    const inProject = tickets.filter(
      (ticket) => ticket.project._id === sharedProjectId,
    );
    const open = tickets.filter((ticket) => ticket.status === "open").length;
    const closed = tickets.length - open;

    // Same boundaries as the page: weeks start on Sunday, in local time
    const now = new Date();
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const createdSince = (date: Date) =>
      tickets.filter((ticket) => new Date(ticket.createdAt) >= date).length;

    // The seeded tickets are all there
    expect(inProject.length).toBe(3);

    await otherPage.goto("/tickets");

    // Stats
    await expect(otherPage.locator("#open-tickets-count")).toHaveText(
      twoDigits(open),
    );
    await expect(otherPage.locator("#closed-tickets-count")).toHaveText(
      twoDigits(closed),
    );
    await expect(otherPage.locator("#week-tickets-count")).toHaveText(
      twoDigits(createdSince(startOfWeek)),
    );
    await expect(otherPage.locator("#month-tickets-count")).toHaveText(
      twoDigits(createdSince(startOfMonth)),
    );

    // Project list counts
    const allProjects = otherPage.locator("#project-ticket-count-all");
    await expect(allProjects.getByLabel("Open tickets")).toHaveText(
      twoDigits(open),
    );
    await expect(allProjects.getByLabel("Closed tickets")).toHaveText(
      twoDigits(closed),
    );
    const project = otherPage.locator(
      "#project-ticket-count-" + sharedProjectId,
    );
    await expect(project.getByLabel("Open tickets")).toHaveText("02");
    await expect(project.getByLabel("Closed tickets")).toHaveText("01");
  });
});
