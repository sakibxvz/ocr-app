import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				fs: false,
				path: false,
				crypto: false,
			};
			config.plugins.push(new NodePolyfillPlugin());
		}

		return config;
	},
};

export default nextConfig;
