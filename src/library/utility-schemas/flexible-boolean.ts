import { z } from "zod/v4";

const FLEXIBLE_BOOL = z.union([
	z
		.union([
			z.literal("1"),
			z.literal("true"),
			z.literal("t"),
			z.literal("yes"),
			z.literal("y"),
			z.literal("on"),
			z.literal("enabled")
		])
		.transform((_) => true),
	z
		.union([
			z.literal("0"),
			z.literal("false"),
			z.literal("f"),
			z.literal("no"),
			z.literal("n"),
			z.literal("off"),
			z.literal("disabled")
		])
		.transform((_) => false)
]);

export default FLEXIBLE_BOOL;
