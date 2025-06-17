import { z } from "zod/v4";

export const debugI18n = z
	.string()
	.refine((s) => s === "true" || s === "false")
	.transform((s) => s === "true")
	.parse(process.env.NEXT_PUBLIC_DEBUG_I18N);

export const i18nName = z.string().parse(process.env.NEXT_PUBLIC_I18N_NAME);

export const passwordMinLength = z
	.string()
	.transform((n) => Number.parseInt(n, 10))
	.pipe(z.number().positive())
	.parse(process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH);
