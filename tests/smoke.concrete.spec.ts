import { expect, test } from "@playwright/test";

test.describe("Concrete calculator smoke", () => {
  test("redirects anonymous user from /concrete to /login", async ({
    page,
  }) => {
    await page.goto("/concrete");
    await expect(page).toHaveURL(/\/login/);
  });
});
