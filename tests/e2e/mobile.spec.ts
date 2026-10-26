import { expect, test } from "@playwright/test";

test("mobile menu opens, navigates and closes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu.getByRole("link", { name: "Necklaces" })).toBeVisible();
  await menu.getByRole("link", { name: "Necklaces" }).click();
  await expect(page).toHaveURL(/\/collections\/necklaces/);
  await expect(page.getByRole("heading", { level: 1, name: "Necklaces" })).toBeVisible();
  await expect(menu).toBeHidden();
});

test("mobile filter drawer applies filters", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("button", { name: /^Filter/ }).click();
  const drawer = page.getByRole("dialog", { name: "Filter" });
  await drawer.getByRole("checkbox", { name: /Rings/ }).check();
  await drawer.getByRole("button", { name: "Show 3 pieces" }).click();
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL(/category=rings/);
  await expect(page.getByText("3 pieces").first()).toBeVisible();
});

test("no horizontal overflow on key pages", async ({ page }) => {
  for (const path of ["/", "/shop", "/products/lumen-line-bracelet", "/about", "/journal", "/checkout", "/contact"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
