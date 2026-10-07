import { test as setup } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  const email = process.env.PW_SETUP_USER_EMAIL!;
  const password = process.env.PW_SETUP_USER_PASSWORD!;

  await page.goto("/login");
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.waitForURL("/dashboard");

  await page.context().storageState({ path: authFile });
});
