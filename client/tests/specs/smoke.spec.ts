import { test, expect } from "@playwright/test";

test("visit dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("main")).toContainText("Recent Projects");
});

