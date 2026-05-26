import { expect, test } from "@playwright/test";

test.describe("Paint calculator smoke", () => {
  test("redirects anonymous user from /paint to /login", async ({ page }) => {
    await page.goto("/paint");
    await expect(page).toHaveURL(/\/login/);
  });
});
