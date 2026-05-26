import { expect, test } from "@playwright/test";

test.describe("History page smoke", () => {
  test("redirects anonymous user from /history to /login", async ({ page }) => {
    await page.goto("/history");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
