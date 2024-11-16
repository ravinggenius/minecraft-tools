import { NextRequest, NextResponse } from "next/server";

import { ensureLocalizedPathname } from "./i18n/server";

const EXCLUDED_PATH_PREFIXES = [
	"/_next",
	"/favicon.ico",
	"/public",
	"/robots.txt",
	"/sitemap.xml"
];

export const middleware = async (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	const isPathExcluded = EXCLUDED_PATH_PREFIXES.some((pathPrefix) =>
		pathname.startsWith(pathPrefix)
	);

	if (isPathExcluded) {
		return;
	}

	const localizedPathname = await ensureLocalizedPathname(pathname);

	if (pathname !== localizedPathname) {
		request.nextUrl.pathname = localizedPathname;

		return NextResponse.redirect(request.nextUrl);
	}
};
