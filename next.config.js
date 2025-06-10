/** @type {import('next').NextConfig} */
const nextConfig = {
	// Note: allowedDevOrigins not supported in Next.js 15.3.3
	// Will be added in future versions for cross-origin dev access

	// PWA and mobile optimization
	headers: async () => {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
