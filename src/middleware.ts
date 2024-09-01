import { NextRequest, NextResponse } from "next/server";

import { extractLocaleFromRequest } from "./i18n/server";
import { SUPPORTED_LOCALES } from "./i18n/settings";

const EXCLUDED_PATH_PREFIXES = [
	"/_next",
	"/favicon.ico",
	"/public",
	"/robots.txt",
	"/sitemap.xml"
];

export const middleware = (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	const isPathExcluded = EXCLUDED_PATH_PREFIXES.some((pathPrefix) =>
		pathname.startsWith(pathPrefix)
	);

	if (isPathExcluded) {
		return;
	}

	const firstSegment = pathname.split("/")[1];

	const hasSupportedLocale = SUPPORTED_LOCALES.some(
		(locale) => locale === firstSegment
	);

	if (hasSupportedLocale) {
		return;
	}

	const locale = extractLocaleFromRequest();

	request.nextUrl.pathname =
		pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

	return NextResponse.redirect(request.nextUrl);
};
