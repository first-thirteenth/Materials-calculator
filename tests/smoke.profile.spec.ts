import { expect, test } from "@playwright/test";

test.describe("Profile page smoke", () => {
  test("redirects anonymous user from /profile to /login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });
});
