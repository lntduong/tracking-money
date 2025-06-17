import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';
import { SessionProvider } from '@/components/providers/SessionProvider';

const beVietnamPro = Be_Vietnam_Pro({
	variable: '--font-be-vietnam-pro',
	subsets: ['latin', 'vietnamese'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
	],
};

export const metadata: Metadata = {
	title: 'Tracking Money',
	description: 'Ứng dụng quản lý chi tiêu cá nhân',
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'Tracking Money',
	},
	formatDetection: {
		telephone: false,
	},
	icons: {
		apple: [
			{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='vi'>
			<body className={`${beVietnamPro.variable} font-sans antialiased`}>
				<SessionProvider>
					<main className='pb-20'>{children}</main>
					<BottomNav />
				</SessionProvider>
			</body>
		</html>
	);
}
