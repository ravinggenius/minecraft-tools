import { z } from "zod/v4";

import FLEXIBLE_BOOL from "@/library/utility-schemas/flexible-boolean";

export const debugI18n = FLEXIBLE_BOOL.parse(
	process.env.NEXT_PUBLIC_DEBUG_I18N
);

export const i18nName = z.string().parse(process.env.NEXT_PUBLIC_I18N_NAME);

export const passwordMinLength = z
	.string()
	.transform((n) => Number.parseInt(n, 10))
	.pipe(z.int().positive())
	.parse(process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH);
