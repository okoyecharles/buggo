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

const test = base.extend<
  {
    projectId: string;
    otherPage: Page;
    otherRequest: APIRequestContext;
  },
  {
    otherUser: {
      details: User;
      storageState: Awaited<ReturnType<BrowserContext["storageState"]>>;
    };
  }
>({
  otherUser: [
    async ({ browser }, use, workerInfo) => {
      // Create other user context
      const context = await browser.newContext();
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
