import { describe, expect, it, test, vi } from "vitest";

import { SupportedLocale } from "@/i18n/settings";

import { buildBreadcrumbs, buildBreadcrumbsWithPrefix } from "./breadcrumbs";

vi.mock("@/i18n/server", () => ({
	loadPageTranslations: vi.fn().mockReturnValue({
		t: (key: string) => key
	})
}));

const LOCALE = "a-locale" as SupportedLocale;

describe(buildBreadcrumbs.name, () => {
	test("empty trail", async () => {
		expect(await buildBreadcrumbs(LOCALE, [])).toEqual([]);
	});

	test("single crumb", async () => {
		expect(await buildBreadcrumbs(LOCALE, [{ name: "foo" }])).toEqual([
			{
				href: "/foo",
				label: "segment-labels.foo",
				name: "foo",
				value: "foo"
			}
		]);
	});

	test("multiple crumbs", async () => {
		expect(
			await buildBreadcrumbs(LOCALE, [
				{ name: "foo" },
				{ name: "bar" },
				{ name: "baz" }
			])
		).toEqual([
			{
				href: "/foo",
				label: "segment-labels.foo",
				name: "foo",
				value: "foo"
			},
			{
				href: "/foo/bar",
				label: "segment-labels.bar",
				name: "bar",
				value: "bar"
			},
			{
				href: "/foo/bar/baz",
				label: "segment-labels.baz",
				name: "baz",
				value: "baz"
			}
		]);
	});

	test("with a dynamic crumb", async () => {
		expect(
			await buildBreadcrumbs(LOCALE, [
				{ name: "foo" },
				{ name: "fooId", value: "foo-id" }
			])
		).toEqual([
			{
				href: "/foo",
				label: "segment-labels.foo",
				name: "foo",
				value: "foo"
			},
			{
				href: "/foo/foo-id",
				label: "segment-labels.fooId",
				name: "fooId",
				value: "foo-id"
			}
		]);
	});
});

describe(buildBreadcrumbsWithPrefix.name, () => {
	test("appending locale crumb", async () => {
		expect(
			await buildBreadcrumbsWithPrefix(LOCALE, [{ name: "foo" }])
		).toEqual([
			{
				href: "/a-locale",
				label: "segment-labels.locale",
				name: "locale",
				value: "a-locale"
			},
			{
				href: "/a-locale/foo",
				label: "segment-labels.foo",
				name: "foo",
				value: "foo"
			}
		]);
	});
});
