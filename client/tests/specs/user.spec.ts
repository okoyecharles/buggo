import { User } from "@/core/types/models";
import { expect, APIResponse } from "@playwright/test";
import path from "path";
import { test } from "../fixtures";

test.describe("user", () => {
  // Edits the worker's other user, so the shared main account stays untouched
  test("edit profile", async ({ otherPage, otherRequest }) => {
    await otherPage.goto("/dashboard");

    // Open the edit profile modal from the account options
    await otherPage.getByRole("button", { name: "Account options" }).click();
    await otherPage
      .locator("#profile-options")
      .getByRole("button", { name: "Edit profile" })
      .click();
    const modal = otherPage.locator("#edit-profile-modal");
    const nameInput = modal.getByLabel("Name");
    const saveButton = modal.getByRole("button", { name: "Save profile" });

    // Nothing changed yet, so there is nothing to save
    await expect(saveButton).toBeDisabled();

    // Invalid name
    await nameInput.fill("abc");
    await saveButton.click();
    await expect(modal).toContainText("Name must be at least 5 characters");

    // Valid name and a new avatar
    const name = "Tester " + Date.now().toString().slice(-6);
    await nameInput.fill(name);
    await modal
      .locator('input[type="file"]')
      .setInputFiles(path.resolve(__dirname, "../../public/circle-logo.png"));
    await expect(modal.getByAltText("Profile image")).toHaveAttribute(
      "src",
      /^data:image/,
    );
    await saveButton.click();
    await expect(
      otherPage.getByText("User updated successfully"),
    ).toBeVisible();

    // Navigation shows the new profile
    const nav = otherPage.getByRole("navigation", { name: "Main" });
    await expect(nav).toContainText(name);
    await expect(nav.getByAltText("profile__image")).toHaveAttribute(
      "src",
      /^data:image/,
    );

    // Confirm edit
    const validateResponse = (await otherRequest.post(
      "/api/users/validate",
    )) as APIResponse<{ user: User }>;
    expect(validateResponse.ok()).toBeTruthy();
    const { user } = await validateResponse.json();
    expect(user.name).toBe(name);
    expect(user.image).toMatch(/^data:image/);
  });
});
