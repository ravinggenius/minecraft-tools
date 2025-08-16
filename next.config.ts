import type { NextConfig } from "next";

export default {
	experimental: {
		authInterrupts: true
	},
	typedRoutes: true,
	webpack: (config) => {
		config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");

		return config;
	}
} satisfies NextConfig;
