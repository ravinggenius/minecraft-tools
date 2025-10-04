import { beforeEach, describe, expect, it, vi } from "vitest";

import { ensureLocalizedPathname, extractLocaleFromRequest } from "./server";

const { headersMock, cookiesMock, mockSettings } = vi.hoisted(() => ({
	headersMock: {
		get: vi.fn().mockReturnValue("header-locale")
	},
	cookiesMock: {
		get: vi.fn().mockImplementation((name: string) => {
			if (name === "locale") {
				return { value: "cookie-locale" };
			}
			return null;
		})
	},
	mockSettings: {
		cookieName: "locale",
		FALLBACK_LOCALE: "fallback-locale" as const,
		SUPPORTED_LOCALES: [
			"fallback-locale",
			"cookie-locale",
			"header-locale"
		] as const
	}
}));

vi.mock("next/headers", () => ({
	headers: vi.fn().mockResolvedValue(headersMock),
	cookies: vi.fn().mockResolvedValue(cookiesMock)
}));

vi.mock("preferred-locale", () => ({
	availableLocales: vi.fn(
		(locales: Array<string>, supportedLocales: Array<string>) =>
			locales.filter((locale) => supportedLocales.includes(locale))
	),
	mergeUserLocales: vi.fn((locales: Array<string>) => [locales[0]])
}));

vi.mock("./settings", () => ({
	...vi.importActual("./settings"),
	...mockSettings
}));

describe(extractLocaleFromRequest.name, () => {
	it("reads locale from cookie", async () => {
		expect(await extractLocaleFromRequest()).toEqual("cookie-locale");
	});

	describe("cookie isn't set", () => {
		beforeEach(() => {
			cookiesMock.get.mockReturnValueOnce(null);
		});

		it("reads locale from header", async () => {
			expect(await extractLocaleFromRequest()).toEqual("header-locale");
		});
	});

	describe("cookie isn't valid", () => {
		beforeEach(() => {
			cookiesMock.get.mockReturnValueOnce("unknown");
		});

		it("reads locale from header", async () => {
			expect(await extractLocaleFromRequest()).toEqual("header-locale");
		});
	});

	describe("invalid cookie and header locales", () => {
		beforeEach(() => {
			cookiesMock.get.mockReturnValueOnce(null);
			headersMock.get.mockReturnValueOnce(null);
		});

		it("returns fallback locale", async () => {
			expect(await extractLocaleFromRequest()).toEqual("fallback-locale");
		});
	});
});

describe(ensureLocalizedPathname.name, () => {
	beforeEach(() => {
		headersMock.get.mockReturnValue("header-locale");

		cookiesMock.get.mockImplementation((name: string) =>
			name === "locale" ? { value: "cookie-locale" } : null
		);
	});

	it("appends default locale", async () => {
		expect(await ensureLocalizedPathname("/")).toEqual("/cookie-locale");
	});

	it("inserts default locale while preserving path", async () => {
		expect(await ensureLocalizedPathname("/about")).toEqual(
			"/cookie-locale/about"
		);
	});

	it("replaces unsupported locale", async () => {
		expect(await ensureLocalizedPathname("/fr-FR/foo/bar/baz")).toEqual(
			"/cookie-locale/foo/bar/baz"
		);
	});
});
