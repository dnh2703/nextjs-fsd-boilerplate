import { expect, test } from "@playwright/test";

test("health endpoint reports ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ status: "ok" });
});

test("adds a todo and shows it in the list", async ({ page }) => {
  const title = `E2E todo ${Date.now()}`;
  await page.goto("/");

  await page.getByLabel("Title").fill(title);
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("listitem").filter({ hasText: title })).toBeVisible();
  await expect(page.getByLabel("Title")).toHaveValue("");
});

test("shows a validation error for a blank title", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Title").fill("   ");
  await page.getByRole("button", { name: "Add" }).click();

  // Scoped to the form: Next.js also renders an empty role="alert" route announcer.
  await expect(page.locator("form").getByRole("alert")).toHaveText("Title is required");
});
