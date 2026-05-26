import { expect, test } from "@playwright/test";

test.describe("Auth smoke", () => {
  test("redirects anonymous user from root to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows login form essentials", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
    await expect(page.getByText("Firebase Auth diagnostics")).toHaveCount(0);
  });

  test("register page does not show firebase diagnostics", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText("Firebase Auth diagnostics")).toHaveCount(0);
  });
});
