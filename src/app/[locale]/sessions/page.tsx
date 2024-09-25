import { redirect } from "next/navigation";

import {
	ensureParams,
	PageProps,
	LOCALE_PARAMS as PARAMS
} from "@/library/route-meta";

export const generateMetadata = async ({ params }: PageProps) => {
	const { locale } = await ensureParams(PARAMS, params);

	redirect(`/${locale}/profile`);
};

export default async function Page() {
	return null;
}
