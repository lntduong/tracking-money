'use client';

import { Home, Wallet, Plus, BarChart3, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
		<div className='fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom'>
			<div className='flex items-center justify-around px-2 py-2'>
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					if (item.isMainAction) {
						// Main action button (Plus button)
						return (
							<Button
								key={item.id}
								asChild
								size='icon'
								className='h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-all duration-200'
							>
								<Link href={item.href}>
									<Icon className='h-6 w-6' />
								</Link>
							</Button>
						);
					}

					// Regular nav items
					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								'flex flex-col items-center justify-center p-2 min-w-[60px] gap-1 rounded-md transition-colors duration-200 hover:bg-accent',
								isActive && 'text-primary',
							)}
						>
							<Icon className={cn('h-5 w-5 transition-colors duration-200')} />
							<span className='text-xs font-medium'>{item.label}</span>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
