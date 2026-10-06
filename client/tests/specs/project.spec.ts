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

    // Create Project
    const projectName = "project " + Date.now();

    await page.getByRole("button", { name: "Create Project" }).click();
    const modal = page.locator("#create-project-modal");
    const titleInput = modal.getByLabel("Title");
    await titleInput.fill(projectName);
    await titleInput.press("Enter");
    const heading = page.getByRole("heading", { name: projectName, level: 2 });
    await expect(heading).toBeVisible();

    // Get project id for cleanup
    await heading.click();
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
    const optionsToggle = page.getByRole("button", { name: "Project options" });
    await expect(optionsToggle).toContainText(projectName);
    await optionsToggle.click();

    const options = page.locator(
      "#project-details-options-" + body.project._id,
    );
    const deleteOption = options.getByRole("button", { name: "Delete" });
    await deleteOption.click();

    const modal = page.locator("#delete-project-modal-" + body.project._id);
    const confirmDelete = modal.getByRole("button", {
      name: "Confirm Delete",
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

    const buttonNames = [
      "Edit Project",
      "Invite Members to Project",
      "Delete Project",
    ];

    await page.goto("/dashboard");
    // creator sees the project
    await expect(page.locator("#project-" + projectId)).toBeVisible();
    // creator sees action buttons
    for (const name of buttonNames) {
      const projectCard = page.locator("#project-" + projectId);
      await projectCard.hover();
      const button = projectCard.getByRole("button", { name }).first();
      await expect(button).toHaveCount(1);
    }

    await otherPage.goto("/dashboard");
    // member sees the project
    await expect(otherPage.locator("#project-" + projectId)).toBeVisible();
    // other user sees none
    for (const name of buttonNames) {
      const projectCard = otherPage.locator("#project-" + projectId);
      await projectCard.hover();
      const button = projectCard.getByRole("button", { name }).first();
      await expect(button).toHaveCount(0);
    }
  });
});
