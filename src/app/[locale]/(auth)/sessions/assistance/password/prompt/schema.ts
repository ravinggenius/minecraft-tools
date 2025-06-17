import { z } from "zod/v4";

import { ACCOUNT } from "@/domains/account/schema";

export const QUERY = z.object({
	email: ACCOUNT.shape.email
});

export interface Query extends z.infer<typeof QUERY> {}
