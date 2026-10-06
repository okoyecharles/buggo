import { expect } from "@playwright/test";
import { test } from "../fixtures";

test.describe("projects", () => {
  let createdProjectId: string | undefined;

  test.afterEach(async ({ request }) => {
    if (createdProjectId) {
      const response = await request.delete(
        "/api/projects/" + createdProjectId,
      );
      expect(response.ok()).toBeTruthy();
      createdProjectId = undefined;
    }
  });

  test("create project", async ({ page }) => {
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Create Project" }).click();

    // Create Project
    const projectName = "ce2e " + Date.now();
    const titleInput = page.getByLabel("Title");
    await titleInput.fill(projectName);
    await titleInput.press("Enter");
    await expect(page.getByRole("main")).toContainText(projectName);

    // Get project id for cleanup
    await page.getByRole("heading", { name: projectName }).click();
    await page.waitForURL("/project/*");
    createdProjectId = page.url().split("/").pop();
  });

  test("edit project title", async ({ page, projectId, request }) => {
    await page.goto("/dashboard");
    const projectCard = page.locator("#project-" + projectId);
    await expect(projectCard).toBeVisible();

    // Edit Project
    // Get first because there are two edit buttons
    // one for mobile and one for desktop
    await projectCard.hover();
    const heading = projectCard.getByRole("heading", { level: 2 });
    const editButton = projectCard
      .getByRole("button", { name: "Edit Project" })
      .first();
    const titleInput = projectCard.getByLabel("Edit Title");

    // Test edit
    const t1 = "project " + Date.now();
    await editButton.click();
    await titleInput.fill(t1);
    await titleInput.press("Enter");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(t1);

    // Test cancel
    const t2 = "project " + Date.now();
    await editButton.click();
    await titleInput.fill(t2);
    await titleInput.press("Escape");
    // Check that the input is reset
    await editButton.click();
    await expect(titleInput).toHaveValue(t1);
    await titleInput.press("Escape");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(t1);

    // Test wrong length
    const t3 = "p";
    await editButton.click();
    await titleInput.fill(t3);
    await titleInput.press("Enter");
    await expect(heading).not.toBeVisible();
    await expect(
      page.getByText("Title must be at least 5 characters"),
    ).toBeVisible();
    await titleInput.press("Escape");

    // Confirm edit
    const getAfterEditResponse = await request.get(
      "/api/projects/" + projectId,
    );
    expect(getAfterEditResponse.ok()).toBeTruthy();
    const body = await getAfterEditResponse.json();
    expect(body.project.title).toBe(t1);
  });

  test("delete project", async ({ page, request }) => {
    const projectName = "de2e " + Date.now();
    const response = await request.post("/api/projects", {
      data: { title: projectName },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    createdProjectId = body.project._id;

    // Delete Project
    await page.goto("/project/" + body.project._id);
    const options = page.getByRole("button", { name: "Project options" });
    await expect(options).toContainText(projectName);
    await options.click();

    const deleteOption = page.getByRole("button", { name: "Delete Project" });
    await deleteOption.click();

    const confirmDelete = page.getByRole("button", {
      name: "Delete",
      exact: true,
    });
    await confirmDelete.click();
    await page.waitForURL("/dashboard");

    // Confirm Deletion
    const getAfterDeleteResponse = await request.get(
      "/api/projects/" + body.project._id,
    );
    expect(getAfterDeleteResponse.status()).toBe(404);
    createdProjectId = undefined;
  });

  test("A non-member should not be able to view a project", async ({
    projectId,
    otherPage,
  }) => {
    await otherPage.goto("/project/" + projectId);
    // Check for redirect and error
    await otherPage.waitForURL("/dashboard");
    const alert = otherPage.locator("#PROJECT_DETAILS_FAIL");
    await expect(alert).toContainText("User not authorized");
  });

  test("A member and non-author should not be able see project options", async ({
    projectId,
    page,
    request,
    otherUser,
    otherPage,
    otherRequest,
  }) => {
    // invite other user to project
    const inviteResponse = await request.put(
      "/api/projects/" + projectId + "/invite",
      {
        data: {
          invitees: [
            { user: otherUser.details._id, email: otherUser.details.email },
          ],
        },
      },
    );
    expect(inviteResponse.ok()).toBeTruthy();
    // other user accepts invite
    const acceptResponse = await otherRequest.put(
      "/api/projects/" + projectId + "/accept-invite",
    );
    expect(acceptResponse.ok()).toBeTruthy();

    await page.goto("/dashboard");
    await otherPage.goto("/dashboard");

    // they both see the project
    await expect(page.locator("#project-" + projectId)).toBeVisible();
    await expect(otherPage.locator("#project-" + projectId)).toBeVisible();

    const buttonIds = [
      "delete-project-" + projectId,
      "edit-project-" + projectId,
      "invite-project-" + projectId,
    ];
    // author sees action buttons
    for (const buttonId of buttonIds) {
      const button = page.locator("#" + buttonId);
      await expect(button).toHaveCount(1);
    }
    // other user sees none
    for (const buttonId of buttonIds) {
      const button = otherPage.locator("#" + buttonId);
      await expect(button).toHaveCount(0);
    }
  });
});
