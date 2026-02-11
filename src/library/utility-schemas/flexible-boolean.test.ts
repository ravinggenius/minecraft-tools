import { describe, expect, it } from "vitest";

import FLEXIBLE_BOOL from "./flexible-boolean";

describe("FLEXIBLE_BOOL", () => {
	it.for(["1", "true", "yes", "y", "on", "enabled"])(
		"parses (%j) as true",
		(psuedoBoolean) => {
			expect(FLEXIBLE_BOOL.safeParse(psuedoBoolean)).toEqual({
				success: true,
				data: true
			});
		}
	);

	it.for(["0", "false", "no", "n", "off", "disabled"])(
		"parses (%j) as false",
		(psuedoBoolean) => {
			expect(FLEXIBLE_BOOL.safeParse(psuedoBoolean)).toEqual({
				success: true,
				data: false
			});
		}
	);

	it.for([true, false, 1, 0, "", [], {}, "whatever"])(
		"doesn't parse anything else (%j)",
		(invalidData) => {
			expect(FLEXIBLE_BOOL.safeParse(invalidData).success).toBe(false);
		}
	);
});
