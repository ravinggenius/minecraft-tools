import type { NextConfig } from "next";

import "./src/services/config-service/service.mjs";

export default {
	experimental: {
		authInterrupts: true,
		typedRoutes: true
	},
	webpack: (config) => {
		config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");

		return config;
	}
} satisfies NextConfig;
