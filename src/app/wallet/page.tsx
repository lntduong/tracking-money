'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Plus,
	ArrowLeftRight,
	Eye,
	Wallet,
	Loader2,
	EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface WalletType {
	id: string;
	name: string;
	icon: string;
	description: string;
}

interface WalletData {
	id: string;
	name: string;
	type: WalletType;
	balance: number;
	transactionCount: number;
	description: string | null;
	isActive: boolean;
	createdAt: string;
}

interface WalletsResponse {
	success: boolean;
	data: {
		wallets: WalletData[];
		totalBalance: number;
		summary: {
			totalWallets: number;
			activeWallets: number;
		};
	};
}

export default function WalletPage() {
	const [wallets, setWallets] = useState<WalletData[]>([]);
	const [totalBalance, setTotalBalance] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isMasked, setIsMasked] = useState(true);

	useEffect(() => {
		fetchWallets();
	}, []);

	const fetchWallets = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/wallets');
			const data: WalletsResponse = await response.json();

			if (data.success) {
				setWallets(data.data.wallets);
				setTotalBalance(data.data.totalBalance);
			} else {
				setError('Không thể tải danh sách ví');
			}
		} catch (err) {
			console.error('Error fetching wallets:', err);
			setError('Lỗi kết nối');
		} finally {
			setLoading(false);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(amount);
	};

	const getWalletGradient = (typeName: string) => {
		switch (typeName.toLowerCase()) {
			case 'cash':
				return 'from-emerald-50 to-emerald-100 border-emerald-200/50';
			case 'bank_account':
				return 'from-blue-50 to-blue-100 border-blue-200/50';
			case 'credit_card':
				return 'from-rose-50 to-rose-100 border-rose-200/50';
			case 'savings':
				return 'from-purple-50 to-purple-100 border-purple-200/50';
			case 'e_wallet':
				return 'from-orange-50 to-orange-100 border-orange-200/50';
			case 'investment':
				return 'from-indigo-50 to-indigo-100 border-indigo-200/50';
			default:
				return 'from-gray-50 to-gray-100 border-gray-200/50';
		}
	};

	const getWalletIconGradient = (typeName: string) => {
		switch (typeName.toLowerCase()) {
			case 'cash':
				return 'from-emerald-500 to-emerald-600';
			case 'bank_account':
				return 'from-blue-500 to-blue-600';
			case 'credit_card':
				return 'from-rose-500 to-rose-600';
			case 'savings':
				return 'from-purple-500 to-purple-600';
			case 'e_wallet':
				return 'from-orange-500 to-orange-600';
			case 'investment':
				return 'from-indigo-500 to-indigo-600';
			default:
				return 'from-gray-500 to-gray-600';
		}
	};

	const getWalletTextColor = (typeName: string) => {
		switch (typeName.toLowerCase()) {
			case 'cash':
				return 'text-emerald-700';
			case 'bank_account':
				return 'text-blue-700';
			case 'credit_card':
				return 'text-rose-700';
			case 'savings':
				return 'text-purple-700';
			case 'e_wallet':
				return 'text-orange-700';
			case 'investment':
				return 'text-indigo-700';
			default:
				return 'text-gray-700';
		}
	};

	const getBadgeVariant = (typeName: string) => {
		switch (typeName.toLowerCase()) {
			case 'cash':
				return 'default';
			case 'credit_card':
				return 'secondary';
			case 'savings':
				return 'outline';
			default:
				return 'secondary';
		}
	};

	return (
		<div className='min-h-screen bg-muted/50 safe-area-top'>
			{/* Header */}
			<div className='bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				{/* Background decoration */}
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				{/* Header content */}
				<div className='relative z-10'>
					<div className='flex justify-between items-center mb-6'>
						<div>
							<p className='text-white/70 text-sm font-medium'>
								Quản lý tài chính
							</p>
							<h1 className='text-2xl font-bold mt-1'>Ví của tôi</h1>
						</div>
						<div className='flex items-center gap-3'>
							<Button
								variant='ghost'
								size='icon'
								className='text-white hover:bg-white/20 h-10 w-10'
								onClick={() => setIsMasked((prev) => !prev)}
							>
								{isMasked ? (
									<EyeOff className='w-5 h-5' />
								) : (
									<Eye className='w-5 h-5' />
								)}
							</Button>
							<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
								<Wallet className='w-5 h-5' />
							</div>
						</div>
					</div>

					{/* Total Balance */}
					<div className='mb-4'>
						<p className='text-white/70 text-sm font-medium'>Tổng số dư</p>
						<p className='text-3xl font-bold mt-1'>
							{isMasked ? '***' : formatCurrency(totalBalance)}
						</p>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className='p-4'>
				<Card>
					<CardContent>
						<div className='grid grid-cols-2 gap-4'>
							<Button
								asChild
								variant='ghost'
								className='flex flex-col items-center p-4 h-auto hover:bg-accent transition-all duration-200 hover:scale-105'
							>
								<Link href='/add-wallet'>
									<div className='w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-2 shadow-lg'>
										<Plus className='w-6 h-6 text-white' />
									</div>
									<span className='text-sm font-medium text-emerald-700'>
										Thêm ví
									</span>
								</Link>
							</Button>

							<Button
								asChild
								variant='ghost'
								className='flex flex-col items-center p-4 h-auto hover:bg-accent transition-all duration-200 hover:scale-105'
							>
								<Link href='/transfer'>
									<div className='w-12 h-12 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center mb-2 shadow-lg'>
										<ArrowLeftRight className='w-6 h-6 text-white' />
									</div>
									<span className='text-sm font-medium text-violet-700'>
										Chuyển khoản
									</span>
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Wallets List */}
			<div className='p-4 space-y-4'>
				<h2 className='text-lg font-semibold text-slate-700'>
					Danh sách ví ({wallets.length})
				</h2>

				{loading && (
					<Card>
						<CardContent className='p-6'>
							<div className='flex items-center justify-center'>
								<Loader2 className='w-6 h-6 animate-spin text-blue-600' />
								<span className='ml-2 text-gray-600'>Đang tải...</span>
							</div>
						</CardContent>
					</Card>
				)}

				{error && (
					<Card>
						<CardContent className='p-6'>
							<div className='text-center text-red-600'>
								<p>{error}</p>
								<Button
									onClick={fetchWallets}
									variant='outline'
									className='mt-2'
								>
									Thử lại
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{!loading && !error && wallets.length === 0 && (
					<Card>
						<CardContent className='p-6'>
							<div className='text-center text-gray-500'>
								<Wallet className='w-12 h-12 mx-auto mb-3 text-gray-400' />
								<p className='text-lg font-medium'>Chưa có ví nào</p>
								<p className='text-sm mt-1'>
									Tạo ví đầu tiên để bắt đầu quản lý tài chính
								</p>
								<Button asChild className='mt-4'>
									<Link href='/add-wallet'>Tạo ví mới</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{!loading &&
					!error &&
					wallets.map((wallet) => (
						<Card
							key={wallet.id}
							className={`bg-gradient-to-br ${getWalletGradient(
								wallet.type.name,
							)}`}
						>
							<CardHeader>
								<CardTitle className='flex justify-between items-center'>
									<div className='flex items-center gap-3'>
										<div
											className={`w-10 h-10 bg-gradient-to-br ${getWalletIconGradient(
												wallet.type.name,
											)} rounded-full flex items-center justify-center`}
										>
											<span className='text-white text-sm'>
												{wallet.type.icon}
											</span>
										</div>
										<span className='text-slate-800'>{wallet.name}</span>
									</div>
									<Badge variant={getBadgeVariant(wallet.type.name)}>
										{wallet.type.name === 'cash' && 'Tiền mặt'}
										{wallet.type.name === 'bank_account' && 'Ngân hàng'}
										{wallet.type.name === 'credit_card' && 'Tín dụng'}
										{wallet.type.name === 'savings' && 'Tiết kiệm'}
										{wallet.type.name === 'e_wallet' && 'Ví điện tử'}
										{wallet.type.name === 'investment' && 'Đầu tư'}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p
									className={`text-3xl font-bold ${getWalletTextColor(
										wallet.type.name,
									)}`}
								>
									{isMasked ? '***' : formatCurrency(wallet.balance)}
								</p>
								<div className='flex justify-between items-center mt-2'>
									<p
										className={`text-sm ${getWalletTextColor(
											wallet.type.name,
										)} opacity-80`}
									>
										{wallet.transactionCount} giao dịch
									</p>
									<p
										className={`text-xs ${getWalletTextColor(
											wallet.type.name,
										)} opacity-60`}
									>
										{new Date(wallet.createdAt).toLocaleDateString('vi-VN')}
									</p>
								</div>
								{wallet.description && (
									<p
										className={`text-sm ${getWalletTextColor(
											wallet.type.name,
										)} opacity-70 mt-1`}
									>
										{wallet.description}
									</p>
								)}
							</CardContent>
						</Card>
					))}
			</div>
		</div>
	);
}
