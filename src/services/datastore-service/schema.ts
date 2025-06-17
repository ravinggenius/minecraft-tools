import { z } from "zod/v4";

export const IDENTITY = z.object({
	id: z.uuid()
});

export interface Identity extends z.infer<typeof IDENTITY> {}

export const VOID = z.strictObject({});
