import { expect, test, type Page } from "@playwright/test";

const plain = (s: string | null) => (s ?? "").replace(/\s+/g, " ").trim();

async function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  return errors;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("e2e-init")) {
      localStorage.clear();
      sessionStorage.setItem("e2e-init", "1");
    }
  });
});

test("homepage renders the brand experience without errors", async ({ page }) => {
  const errors = await collectErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Every piece\s*tells a story\./);
  await expect(page.getByRole("link", { name: "Explore the collection" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find the piece that is yours" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Letters from Ratna" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("bag: size is required, totals are correct, and the bag survives a reload", async ({ page }) => {
  await page.goto("/products/aurelle-solitaire-ring");
  const add = page.getByRole("button", { name: "Add to bag" });

  await add.click();
  await expect(page.locator("main").getByRole("alert")).toHaveText(/Choose a ring size/i);

  // The radio is visually hidden; people click its label, so the test does too.
  const size7 = page.getByRole("radio", { name: "US 7" });
  await page.locator("label").filter({ has: size7 }).click();
  await expect(size7).toBeChecked();
  await add.click();

  const drawer = page.getByRole("dialog", { name: /Your bag/ });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Aurelle Solitaire Ring" })).toBeVisible();
  await expect(drawer.getByText("US 7")).toBeVisible();
  expect(plain(await drawer.getByText(/^Rs/).last().textContent())).toBe("Rs 4,85,000");

  await drawer.getByRole("button", { name: "Increase quantity" }).click();
  await expect(drawer.getByText("Rs 9,70,000").first()).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Increase quantity" })).toBeDisabled(); // max 2

  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(page.getByRole("button", { name: "Shopping bag, 2 items" })).toBeVisible();

  await page.reload();
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible();
  await expect(page.getByText("Rs 9,70,000").first()).toBeVisible();

  await page.getByRole("button", { name: "Remove Aurelle Solitaire Ring" }).click();
  await expect(page.getByText("Your bag is empty.")).toBeVisible();
});

test("bag: unavailable sizes cannot be chosen", async ({ page }) => {
  await page.goto("/products/sera-stacking-set");
  await expect(page.getByRole("radio", { name: /US 9, unavailable/ })).toBeDisabled();
});

test("wishlist: save from a card and find it on the wishlist page after reload", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("button", { name: "Save Luna Pearl Drops to wishlist" }).click();
  await expect(page.getByRole("button", { name: "Remove Luna Pearl Drops from wishlist" })).toHaveAttribute("aria-pressed", "true");
  await page.goto("/wishlist");
  await page.reload();
  await expect(page.getByRole("heading", { name: "Luna Pearl Drops" })).toBeVisible();
  await page.getByRole("button", { name: "Remove Luna Pearl Drops from wishlist" }).click();
  await expect(page.getByText("Nothing saved yet.")).toBeVisible();
});

test("shop: filters and sorting change the results and the URL", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByText("8 pieces").first()).toBeVisible();

  await page.getByRole("checkbox", { name: /Earrings/ }).check();
  await expect(page).toHaveURL(/category=earrings/);
  await expect(page.getByText("1 piece", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Earrings\s*, remove filter/ })).toBeVisible();

  await page.getByRole("button", { name: "Clear all" }).click();
  await expect(page.getByText("8 pieces")).toBeVisible();

  await page.getByLabel("Sort by").selectOption("price-asc");
  await expect(page).toHaveURL(/sort=price-asc/);
  const names = await page.locator("main article h3").allTextContents();
  expect(names[0]).toBe("Duet Layered Necklace");
  expect(names.at(-1)).toBe("Verdant Emerald Pendant");

  // State lives in the URL, so a reload restores it
  await page.goto("/shop?occasion=wedding&price=over-500k");
  await expect(page.getByText("2 pieces")).toBeVisible();
});

test("shop: impossible filter combinations show an empty state that recovers", async ({ page }) => {
  await page.goto("/collections/earrings?price=over-500k");
  await expect(page.getByText("No pieces match these filters.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByText("1 piece", { exact: true })).toBeVisible();
});

test("search: overlay suggestions and the results page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Search the collection" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Search jewellery").fill("emerald");
  await expect(dialog.getByRole("link", { name: /Verdant Emerald Pendant/ })).toBeVisible();
  await dialog.getByLabel("Search jewellery").press("Enter");
  await expect(page).toHaveURL(/\/search\?q=emerald/);
  await expect(page.getByText(/1 result for “emerald”/)).toBeVisible();

  await page.goto("/search?q=sapphire");
  await expect(page.getByText("Nothing matches “sapphire”.")).toBeVisible();
});

test("collections mega menu opens on hover and navigates", async ({ page }) => {
  await page.goto("/shop");
  // Move the pointer in steps, as a person would, so hover intent registers.
  const trigger = page.getByRole("button", { name: "Collections" });
  const box = (await trigger.boundingBox())!;
  await page.mouse.move(box.x - 30, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 6 });
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const bridal = page.getByRole("link", { name: /^Bridal\s*For the day/ });
  await expect(bridal).toBeVisible();
  await bridal.click();
  await expect(page).toHaveURL(/\/collections\/bridal/);
  await expect(page.getByRole("heading", { level: 1, name: "Bridal" })).toBeVisible();
});

test("product gallery: thumbnails switch images and the lightbox opens and closes", async ({ page }) => {
  await page.goto("/products/verdant-emerald-pendant");
  const region = page.getByRole("region", { name: "Verdant Emerald Pendant images" });
  await page.getByRole("button", { name: "Show image 2 of 3" }).click();
  await expect(region.getByRole("img", { name: /step-cut facets/ })).toBeVisible();
  await page.getByRole("button", { name: /Enlarge/ }).click();
  const lightbox = page.getByRole("dialog", { name: /Verdant Emerald Pendant/ });
  await expect(lightbox).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(lightbox.getByText("3 / 3")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(lightbox).toBeHidden();
});

test("newsletter validates and reports honestly when no provider is connected", async ({ page }) => {
  await page.goto("/about");
  const form = page.locator("#letters");
  await form.getByLabel("Email address").fill("not-an-email");
  await form.getByRole("button", { name: /Subscribe/ }).click();
  await expect(form.getByText(/name@example.com/)).toBeVisible();
  await form.getByLabel("Email address").fill("reader@example.com");
  await form.getByRole("button", { name: /Subscribe/ }).click();
  await expect(form.getByText(/mailing list isn.t connected yet/)).toBeVisible();
});

test("checkout: validates fields and keeps the bag when enquiries are not connected", async ({ page }) => {
  await page.goto("/products/pear-drop-pendant");
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.getByRole("dialog", { name: /Your bag/ }).getByRole("link", { name: "Continue to checkout" }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByRole("heading", { name: "Your order" })).toBeVisible();

  await page.getByRole("button", { name: "Send order enquiry" }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await expect(page.getByLabel("Name", { exact: true })).toBeFocused();

  await page.getByLabel("Name", { exact: true }).fill("Asha Rai");
  await page.getByLabel("Email", { exact: true }).fill("asha@example.com");
  await page.getByRole("button", { name: "Send order enquiry" }).click();
  await expect(page.getByText(/Online enquiries aren.t connected yet/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Shopping bag, 1 item" })).toBeVisible();
});

test("unknown routes return a real 404 with helpful links", async ({ page }) => {
  for (const path of ["/products/not-a-piece", "/collections/hats", "/journal/nope", "/nothing-here"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(404);
  }
  await expect(page.getByRole("heading", { name: "This piece has gone missing." })).toBeVisible();
});

test("keyboard: skip link and focus are available", async ({ page }) => {
  await page.goto("/shop");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});
