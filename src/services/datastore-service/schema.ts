import { z } from "zod/v4";

export const IDENTITY = z.object({
	id: z.uuid()
});

export type Identity = z.infer<typeof IDENTITY>;

export const VOID = z.strictObject({});
