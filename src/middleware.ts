import acceptLanguage from "accept-language";
import { NextRequest, NextResponse } from "next/server";

import {
	FALLBACK_LOCALE,
	SUPPORTED_LOCALES,
	cookieName
} from "@/i18n/settings";

acceptLanguage.languages([...SUPPORTED_LOCALES]);

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"]
};

export const middleware = (request: NextRequest) => {
	const locale =
		acceptLanguage.get(
			request.cookies.get(cookieName)?.value ??
				request.headers.get("Accept-Language")
		) ?? FALLBACK_LOCALE;

	if (
		!SUPPORTED_LOCALES.some((loc) =>
			request.nextUrl.pathname.startsWith(`/${loc}`)
		) &&
		!request.nextUrl.pathname.startsWith("/_next")
	) {
		return NextResponse.redirect(
			new URL(`/${locale}${request.nextUrl.pathname}`, request.url)
		);
	}

	if (request.headers.has("referer")) {
		const refererUrl = new URL(request.headers.get("referer") as string);

		const lngInReferer = SUPPORTED_LOCALES.find((l) =>
			refererUrl.pathname.startsWith(`/${l}`)
		);

		const response = NextResponse.next();

		if (lngInReferer) response.cookies.set(cookieName, lngInReferer);

		return response;
	}

	return NextResponse.next();
};
