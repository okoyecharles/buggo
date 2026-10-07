import avatars from "@/core/assets/avatar";
import { User } from "@/core/types/models";
import {
  test as base,
  expect,
  APIResponse,
  APIRequestContext,
  BrowserContext,
  Page,
} from "@playwright/test";

type UserContext = {
  details: User;
  storageState: Awaited<ReturnType<BrowserContext["storageState"]>>;
};

const test = base.extend<
  {
    projectId: string;
    sharedProjectId: string;
    otherPage: Page;
    otherRequest: APIRequestContext;
    adminPage: Page;
    adminRequest: APIRequestContext;
  },
  {
    otherUser: UserContext;
    adminUser: UserContext;
  }
>({
  adminUser: [
    async ({ browser }, use, workerInfo) => {
			const { baseURL } = workerInfo.project.use;
      // Login to admin user in context
      const context = await browser.newContext({ baseURL });
      const request = context.request;
      const signInAdminResponse = await request.post("/api/users/signin", {
        data: {
          email: process.env.PW_SETUP_ADMIN_EMAIL,
          password: process.env.PW_SETUP_ADMIN_PASSWORD,
        },
      });
      expect(signInAdminResponse.ok()).toBeTruthy();
      const { user } = await signInAdminResponse.json();
      const storageState = await context.storageState();

      await use({
        details: user,
        storageState,
      });

      await context.close();
    },
    { scope: "worker" },
  ],
  adminPage: async ({ browser, adminUser }, use) => {
    const context = await browser.newContext({
      storageState: adminUser.storageState,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  adminRequest: async ({ adminPage }, use) => {
    await use(adminPage.request);
  },
  otherUser: [
    async ({ browser, adminUser }, use, workerInfo) => {
      // get base url because a request is called after teardown
      const { baseURL } = workerInfo.project.use;
      // Create other user context
      const context = await browser.newContext({ baseURL });
      const request = context.request;

      const createUserResponse = (await request.post("/api/users/signup", {
        data: {
          name: "Test User " + workerInfo.workerIndex,
          email:
            String(workerInfo.workerIndex) +
            String(Date.now()) +
            "@example.com",
          password: "password",
          image: avatars[0],
        },
      })) as APIResponse<{ user: User }>;
      expect(createUserResponse.ok()).toBeTruthy();
      const { user } = await createUserResponse.json();
      const storageState = await context.storageState();
      await use({
        details: user,
        storageState,
      });

      const adminContext = await browser.newContext({
        baseURL,
        storageState: adminUser.storageState,
      });
      const deleteUserResponse = await adminContext.request.delete(
        `/api/users/${user._id}`,
      );
      expect(deleteUserResponse.ok()).toBeTruthy();
      await adminContext.close();

      await context.close();
    },
    { scope: "worker" },
  ],
  otherPage: async ({ browser, otherUser }, use) => {
    const context = await browser.newContext({
      storageState: otherUser.storageState,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
  otherRequest: async ({ otherPage }, use) => {
    await use(otherPage.request);
  },
  sharedProjectId: async (
    { projectId, request, otherUser, otherRequest },
    use,
  ) => {
    // The other user joins through the API, so specs start with two members
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
    const acceptResponse = await otherRequest.put(
      "/api/projects/" + projectId + "/accept-invite",
    );
    expect(acceptResponse.ok()).toBeTruthy();
    await use(projectId);
  },
  projectId: async ({ request }, use) => {
    const projectTitle = "te2e " + Date.now();
    const response = await request.post("/api/projects", {
      data: { title: projectTitle },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    await use(body.project._id);
    const deleteResponse = await request.delete(
      "/api/projects/" + body.project._id,
    );
    expect(deleteResponse.ok()).toBeTruthy();
  },
});

export { test };
