import "./src/library/_/config.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true
	}
};

export default nextConfig;
