import "./src/services/config-service/service.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		typedRoutes: true
	},
	webpack: (config) => {
		config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");

		return config;
	}
};

export default nextConfig;
