import { expect, test } from "@playwright/test";

test.describe("Brick calculator smoke", () => {
  test("redirects anonymous user from /brick to /login", async ({ page }) => {
    await page.goto("/brick");
    await expect(page).toHaveURL(/\/login/);
  });
});
