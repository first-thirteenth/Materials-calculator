import { expect, test } from "@playwright/test";

test.describe("Navigation smoke", () => {
  test("login page has link to register", async ({ page }) => {
    await page.goto("/login");
    const registerLink = page.getByRole("link", {
      name: /register|sign up|зарегистр|реєстр|zarejestr/i,
    });
    await expect(registerLink).toBeVisible();
  });

  test("register page has link to login", async ({ page }) => {
    await page.goto("/register");
    const loginLink = page.getByRole("link", {
      name: /log in|sign in|войти|увійти|zaloguj/i,
    });
    await expect(loginLink).toBeVisible();
  });

  test("unknown route redirects to login for anonymous user", async ({
    page,
  }) => {
    await page.goto("/some-unknown-route-404");
    await expect(page).toHaveURL(/\/login/);
  });
});
