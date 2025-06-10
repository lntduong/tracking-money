'use client';

import { Home, Wallet, Plus, BarChart3, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
	{
		id: 'home',
		label: 'Trang chủ',
		icon: Home,
		href: '/',
	},
	{
		id: 'wallet',
		label: 'Ví',
		icon: Wallet,
		href: '/wallet',
	},
	{
		id: 'add',
		label: '',
		icon: Plus,
		href: '/add',
		isMainAction: true,
	},
	{
		id: 'reports',
		label: 'Báo cáo',
		icon: BarChart3,
		href: '/reports',
	},
	{
		id: 'account',
		label: 'Tài khoản',
		icon: User,
		href: '/account',
	},
];

export function BottomNav() {
	const pathname = usePathname();

	return (
		<div className='fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border safe-area-bottom'>
			<div className='flex items-center justify-around px-2 py-2'>
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					if (item.isMainAction) {
						// Main action button (Plus button)
						return (
							<Link
								key={item.id}
								href={item.href}
								className='flex flex-col items-center justify-center p-2'
							>
								<div className='bg-blue-600 hover:bg-blue-700 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105'>
									<Icon className='h-6 w-6 text-white' />
								</div>
							</Link>
						);
					}

					// Regular nav items
					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								'flex flex-col items-center justify-center p-2 min-w-[60px] transition-colors duration-200',
								'hover:bg-gray-50 rounded-lg',
							)}
						>
							<Icon
								className={cn(
									'h-5 w-5 mb-1 transition-colors duration-200',
									isActive
										? 'text-blue-600'
										: 'text-gray-500 hover:text-gray-700',
								)}
							/>
							<span
								className={cn(
									'text-xs font-medium transition-colors duration-200',
									isActive
										? 'text-blue-600'
										: 'text-gray-500 hover:text-gray-700',
								)}
							>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
