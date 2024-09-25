import { expect, test } from "@playwright/test";

test.describe("the home page", () => {
	test("the environment", async ({ page }) => {
		await expect(process.env.NODE_ENV).toEqual("test");
	});

	test("has site title", async ({ page }) => {
		await page.goto("/");

		await expect(page).toHaveTitle(/minecraft tools/i);
	});

	test("has main menu", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByLabel("open table of contents")).toBeVisible();
	});

	test("main menu toggles", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByText("Sign Up")).not.toBeVisible();

		await page.getByLabel("open table of contents").click();

		await expect(page.getByText("Sign Up")).toBeVisible();

		await page.getByLabel("close table of contents").click();

		await expect(page.getByText("Sign Up")).not.toBeVisible();
	});
});
