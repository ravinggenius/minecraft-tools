import type { NextConfig } from "next";

export default {
	experimental: {
		authInterrupts: true
	},
	typedRoutes: true
} satisfies NextConfig;
