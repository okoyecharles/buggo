import avatars from "@/core/assets/avatar";
import { User } from "@/core/types/models";
import { expect, Page } from "@playwright/test";
import { test as base } from "../fixtures";
import { gotoWithSocket } from "../helpers";

// A user made for one test so deleting it can't affect anything else
const test = base.extend<{ victim: { details: User; page: Page } }>({
  victim: async ({ browser, adminRequest }, use) => {
    const context = await browser.newContext();
    const signupResponse = await context.request.post("/api/users/signup", {
      data: {
        name: "Victim " + Date.now().toString().slice(-6),
        email: "victim" + Date.now() + "@example.com",
        password: "password",
        image: avatars[0],
      },
    });
    expect(signupResponse.ok()).toBeTruthy();
    const { user } = await signupResponse.json();
    const page = await context.newPage();

    await use({ details: user, page });

    // The test deletes it, so this only cleans up after a failed run
    const deleteResponse = await adminRequest.delete("/api/users/" + user._id);
    expect([200, 404]).toContain(deleteResponse.status());
    await context.close();
  },
});

test.describe("admin tests", () => {
  test("non-admins can't open the users page", async ({ page }) => {
    await page.goto("/users");
    await expect(page.getByText("You're not authorized")).toBeVisible();
    await expect(page.locator(".users-list")).toHaveCount(0);
  });

  test("counts match the users the page loaded", async ({ adminPage }) => {
    // Other workers sign users up and delete them at any time, so compare
    // against the exact list this page received rather than a second fetch
    const usersResponse = adminPage.waitForResponse(
      (response) =>
        response.url().endsWith("/api/users") &&
        response.request().method() === "GET",
    );
    await adminPage.goto("/users");
    const { users } = (await (await usersResponse).json()) as { users: User[] };

    await expect(adminPage.locator("#users-total-count")).toHaveText(
      `${users.length} total`,
    );
    await expect(adminPage.locator("#users-admin-count")).toHaveText(
      `${users.filter((user) => user.admin).length} admin`,
    );
    await expect(adminPage.locator(".users-list > li")).toHaveCount(
      users.length,
    );
  });

  test("search filters users by name or email", async ({
    adminPage,
    victim,
  }) => {
    await adminPage.goto("/users");
    const rows = adminPage.locator(".users-list > li");
    const victimRow = adminPage.locator("#user-row-" + victim.details._id);
    // The mobile copy of the search box is hidden on desktop
    const search = adminPage
      .getByRole("textbox", { name: "Search users" })
      .filter({ visible: true });

    // By email
    await search.fill(victim.details.email.split("@")[0]);
    await expect(rows).toHaveCount(1);
    await expect(victimRow).toBeVisible();

    // By name, ignoring case
    await search.fill(victim.details.name.toUpperCase());
    await expect(rows).toHaveCount(1);
    await expect(victimRow).toBeVisible();

    // No match
    await search.fill("nobody" + Date.now());
    await expect(rows).toHaveCount(0);

    // Clearing brings everyone back
    await search.fill("");
    await expect(victimRow).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(1);
  });

  test("deleting a user signs them out and updates every admin live", async ({
    browser,
    adminUser,
    adminPage,
    victim,
  }) => {
    const { details } = victim;

    // A second admin tab that should drop the user without reloading
    const watcherContext = await browser.newContext({
      storageState: adminUser.storageState,
    });
    const watcher = await watcherContext.newPage();

    await gotoWithSocket(victim.page, "/dashboard");
    await gotoWithSocket(watcher, "/users");
    await adminPage.goto("/users");

    const row = adminPage.locator("#user-row-" + details._id);
    const watcherRow = watcher.locator("#user-row-" + details._id);
    await expect(row).toBeVisible();
    await expect(watcherRow).toBeVisible();

    // Delete through the UI
    await row.getByRole("button", { name: `Delete ${details.name}` }).click();
    await adminPage
      .locator("#delete-user-modal-" + details._id)
      .getByRole("button", { name: `Confirm delete for user: ${details.name}` })
      .click();
    await expect(adminPage.getByText("User deleted successfully.")).toBeVisible();
    await expect(row).toHaveCount(0);

    // The other admin tab updates live
    await expect(watcherRow).toHaveCount(0);

    // The deleted user is told why and signed out
    await expect(
      victim.page.getByText("Due to policy violation, This account has been deleted"),
    ).toBeVisible();
    await expect(victim.page).toHaveURL(/\/login/);

    // Their session no longer works
    const validateResponse = await victim.page.request.post(
      "/api/users/validate",
    );
    expect(validateResponse.ok()).toBeFalsy();

    await watcherContext.close();
  });
});
