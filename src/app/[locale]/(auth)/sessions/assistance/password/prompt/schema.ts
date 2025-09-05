import { z } from "zod/v4";

import { ACCOUNT } from "@/domains/account/schema";

export const QUERY = z.object({
	email: ACCOUNT.shape.email
});

export type Query = z.infer<typeof QUERY>;
