import { expect } from "@playwright/test";
import { test } from "../fixtures";

test("smoke", async ({ otherPage }) => {
  await otherPage.goto("/dashboard");
  await expect(otherPage.getByRole("main")).toContainText("Recent Projects");
});

