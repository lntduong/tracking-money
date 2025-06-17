'use client';

import { useEffect, useState } from 'react';
import {
	Settings,
	Bell,
	HelpCircle,
	LogOut,
	User,
	ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface AccountData {
	id: string;
	email: string;
	fullName: string;
	avatarUrl: string | null;
	isPremium: boolean;
	memberSince: string;
	lastLogin: string | null;
	stats: {
		transactionCount: number;
		walletCount: number;
		daysSinceMember: number;
	};
}

export default function AccountPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [accountData, setAccountData] = useState<AccountData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/auth/signin');
			return;
		}

		if (status === 'authenticated') {
			fetchAccountData();
		}
	}, [status, retryCount]);

	const fetchAccountData = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch('/api/account');
			const result = await response.json();

			if (result.success) {
				setAccountData(result.data);
			} else {
				setError(result.error || 'Failed to fetch account data');
			}
		} catch (err) {
			console.error('Error fetching account data:', err);
			setError('Failed to fetch account data');
		} finally {
			setLoading(false);
		}
	};

	const handleRetry = () => {
		setRetryCount((prev) => prev + 1);
	};

	const handleLogout = async () => {
		try {
			// Call logout API
			const response = await fetch('/api/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Failed to logout');
			}

			// Sign out from NextAuth
			await signOut({ redirect: false });

			// Clear any local storage or state
			localStorage.clear();
			sessionStorage.clear();

			// Redirect to login page
			router.push('/auth/signin');
		} catch (error) {
			console.error('Logout error:', error);
			// Still try to redirect to login page even if there's an error
			router.push('/auth/signin');
		}
	};

	if (status === 'loading' || loading) {
		return (
			<div className='min-h-screen bg-muted/50 safe-area-top flex items-center justify-center'>
				<div className='text-center'>
					<div className='w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
					<p className='text-gray-600'>Đang tải thông tin...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-muted/50 safe-area-top flex items-center justify-center'>
				<div className='text-center'>
					<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<HelpCircle className='w-8 h-8 text-red-600' />
					</div>
					<p className='text-gray-900 font-medium mb-2'>Có lỗi xảy ra</p>
					<p className='text-gray-600 mb-4'>{error}</p>
					<Button
						onClick={handleRetry}
						className='bg-purple-600 hover:bg-purple-700'
					>
						Thử lại
					</Button>
				</div>
			</div>
		);
	}

	if (!accountData) {
		return null;
	}

	// Get initials from full name
	const initials = accountData.fullName
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase();

	// Format member since date
	const memberSinceDate = new Date(accountData.memberSince);
	const formattedMemberSince = format(memberSinceDate, 'MMMM yyyy', {
		locale: vi,
	});

	return (
		<div className='min-h-screen bg-muted/50 safe-area-top'>
			{/* Header */}
			<div className='bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				{/* Background decoration */}
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				{/* Header content */}
				<div className='relative z-10'>
					<div className='flex justify-between items-center mb-6'>
						<div>
							<p className='text-white/70 text-sm font-medium'>
								Thông tin cá nhân
							</p>
							<h1 className='text-2xl font-bold mt-1'>Tài khoản</h1>
						</div>
						<div className='flex items-center gap-3'>
							<Button
								variant='ghost'
								size='icon'
								className='text-white hover:bg-white/20 h-10 w-10'
							>
								<Settings className='w-5 h-5' />
							</Button>
							<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
								<User className='w-5 h-5' />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='p-4 space-y-6'>
				{/* User Profile */}
				<Card className='bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg'>
					<CardContent className='p-6'>
						<div className='flex items-center space-x-4'>
							<div className='relative'>
								<Avatar className='w-20 h-20 border-4 border-purple-200'>
									{accountData.avatarUrl ? (
										<img
											src={accountData.avatarUrl}
											alt={accountData.fullName}
											className='w-full h-full object-cover'
										/>
									) : (
										<AvatarFallback className='bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-2xl font-bold'>
											{initials}
										</AvatarFallback>
									)}
								</Avatar>
								<div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center'>
									<div className='w-2 h-2 bg-white rounded-full'></div>
								</div>
							</div>
							<div className='flex-1'>
								<div className='flex items-center gap-2 mb-1'>
									<h2 className='text-xl font-bold text-gray-900'>
										{accountData.fullName}
									</h2>
									{accountData.isPremium && (
										<Badge className='bg-purple-100 text-purple-700 hover:bg-purple-200'>
											Premium
										</Badge>
									)}
								</div>
								<p className='text-gray-600 mb-2'>{accountData.email}</p>
								<p className='text-sm text-gray-500'>
									Thành viên từ: {formattedMemberSince}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Quick Stats */}
				<div className='grid grid-cols-3 gap-3'>
					<Card className='bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'>
						<CardContent className='p-4 text-center'>
							<div className='text-2xl font-bold text-emerald-700'>
								{accountData.stats.transactionCount}
							</div>
							<p className='text-xs text-emerald-600'>Giao dịch</p>
						</CardContent>
					</Card>
					<Card className='bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'>
						<CardContent className='p-4 text-center'>
							<div className='text-2xl font-bold text-blue-700'>
								{accountData.stats.walletCount}
							</div>
							<p className='text-xs text-blue-600'>Ví</p>
						</CardContent>
					</Card>
					<Card className='bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'>
						<CardContent className='p-4 text-center'>
							<div className='text-2xl font-bold text-amber-700'>
								{accountData.stats.daysSinceMember}
							</div>
							<p className='text-xs text-amber-600'>Ngày sử dụng</p>
						</CardContent>
					</Card>
				</div>

				{/* Menu Items */}
				<Card className='bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg'>
					<CardHeader className='pb-3'>
						<CardTitle className='flex items-center space-x-2'>
							<Settings className='h-5 w-5 text-purple-600' />
							<span>Cài đặt</span>
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-1'>
						<Button
							variant='ghost'
							className='w-full justify-between h-auto p-4 hover:bg-purple-50 group transition-all duration-200'
						>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform'>
									<Settings className='w-5 h-5 text-purple-600' />
								</div>
								<div className='text-left'>
									<span className='font-semibold text-gray-900'>
										Cài đặt chung
									</span>
									<p className='text-xs text-gray-500'>
										Ngôn ngữ, tiền tệ, thông báo
									</p>
								</div>
							</div>
							<ChevronRight className='w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors' />
						</Button>

						<Button
							variant='ghost'
							className='w-full justify-between h-auto p-4 hover:bg-blue-50 group transition-all duration-200'
						>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform'>
									<Bell className='w-5 h-5 text-blue-600' />
								</div>
								<div className='text-left'>
									<span className='font-semibold text-gray-900'>Thông báo</span>
									<p className='text-xs text-gray-500'>
										Quản lý cảnh báo và nhắc nhở
									</p>
								</div>
							</div>
							<ChevronRight className='w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors' />
						</Button>

						<Button
							variant='ghost'
							className='w-full justify-between h-auto p-4 hover:bg-green-50 group transition-all duration-200'
						>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform'>
									<HelpCircle className='w-5 h-5 text-green-600' />
								</div>
								<div className='text-left'>
									<span className='font-semibold text-gray-900'>
										Trợ giúp & Hỗ trợ
									</span>
									<p className='text-xs text-gray-500'>FAQ, liên hệ hỗ trợ</p>
								</div>
							</div>
							<ChevronRight className='w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors' />
						</Button>
					</CardContent>
				</Card>

				{/* Logout */}
				<Card className='bg-gradient-to-br from-rose-50 to-red-50 border-rose-200'>
					<CardContent className='p-0'>
						<Button
							variant='ghost'
							onClick={handleLogout}
							className='w-full justify-start h-auto p-4 text-rose-700 hover:bg-rose-100 hover:text-rose-800 group transition-all duration-200'
						>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform'>
									<LogOut className='w-5 h-5 text-rose-600' />
								</div>
								<div className='text-left'>
									<span className='font-semibold'>Đăng xuất</span>
									<p className='text-xs text-rose-600'>Thoát khỏi tài khoản</p>
								</div>
							</div>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
