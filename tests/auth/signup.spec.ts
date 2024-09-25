import { expect, test } from "@playwright/test";

test.describe("signup for new account", () => {
	test("finding signup page", async ({ page }) => {
		await page.goto("/");

		await page.getByLabel("open table of contents").click();

		await page.getByText("Sign Up").click();

		await expect(page).toHaveURL("/en-US/profiles/new");
	});
});
