import {
	Eye,
	TrendingUp,
	TrendingDown,
	ArrowLeftRight,
	Wallet,
	Tag,
	BarChart3,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function HomePage() {
	return (
		<div className='min-h-screen bg-muted/50 safe-area-top'>
			{/* Header */}
			<div className='bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				{/* Background decoration */}
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				{/* Header content */}
				<div className='relative z-10'>
					<div className='flex justify-between items-center mb-2'>
						<div>
							<p className='text-white/70 text-sm font-medium'>
								Chào buổi sáng 👋
							</p>
						</div>
						<div className='flex items-center gap-3'>
							<Button
								variant='ghost'
								size='icon'
								className='text-white hover:bg-white/20 h-10 w-10'
							>
								<Eye className='w-5 h-5' />
							</Button>
							<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
								<span className='text-lg'>🔔</span>
							</div>
						</div>
					</div>
				</div>

				{/* Balance Card */}
				<Card className='bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-sm border-slate-700/30 shadow-2xl relative overflow-hidden'>
					{/* Card decorative elements */}
					<div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full -translate-y-16 translate-x-16'></div>
					<div className='absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-purple-600/10 rounded-full translate-y-20 -translate-x-20'></div>

					<CardContent className='p-6 relative z-10'>
						{/* Card header with bank info */}
						<div className='flex justify-between items-start mb-6'>
							<div>
								<p className='text-yellow-400 text-sm font-semibold tracking-wider'>
									TRACKING BANK
								</p>
								<p className='text-slate-400 text-xs'>Premium Card</p>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-8 h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-sm'></div>
								<div className='w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full'></div>
							</div>
						</div>

						{/* Chip */}
						<div className='w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mb-4 flex items-center justify-center'>
							<div className='w-8 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm'></div>
						</div>

						{/* Card Number */}
						<div className='mb-4'>
							<p className='text-white text-lg font-mono tracking-widest'>
								•••• •••• •••• 2025
							</p>
						</div>

						{/* Balance */}
						<div className='mb-4'>
							<p className='text-slate-300 text-sm font-medium'>
								Số dư khả dụng
							</p>
							<p className='text-white text-3xl font-bold mt-1'>
								6,250,000 VNĐ
							</p>
						</div>

						{/* Card details */}
						<div className='flex justify-between items-end'>
							<div>
								<p className='text-slate-400 text-xs'>Chủ thẻ</p>
								<p className='text-white text-sm font-semibold'>NGUYEN VAN A</p>
							</div>
							<div className='text-right'>
								<p className='text-slate-400 text-xs'>Hết hạn</p>
								<p className='text-white text-sm font-mono'>12/29</p>
							</div>
						</div>

						{/* Income/Expense summary */}
						<div className='flex gap-4 mt-6 pt-4 border-t border-slate-700'>
							<div className='flex-1 text-center'>
								<TrendingUp className='w-5 h-5 text-emerald-400 mx-auto mb-1' />
								<p className='text-emerald-400 text-sm font-bold'>+15M VNĐ</p>
								<p className='text-slate-400 text-xs'>Thu nhập</p>
							</div>
							<div className='flex-1 text-center'>
								<TrendingDown className='w-5 h-5 text-rose-400 mx-auto mb-1' />
								<p className='text-rose-400 text-sm font-bold'>-8.7M VNĐ</p>
								<p className='text-slate-400 text-xs'>Chi tiêu</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className='p-4'>
				<Card className='-py-6'>
					<CardContent className='p-4'>
						<div className='grid grid-cols-3 gap-3'>
							{/* Row 1 */}
							<Button
								asChild
								variant='ghost'
								className='flex flex-col items-center p-2 h-auto hover:bg-accent transition-all duration-200 hover:scale-105'
							>
								<Link href='/add'>
									<div className='w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-1 shadow-lg'>
										<TrendingUp className='w-5 h-5 text-white' />
									</div>
									<span className='text-xs font-medium text-emerald-700'>
										Thu nhập
									</span>
								</Link>
							</Button>

							<Button
								asChild
								variant='ghost'
								className='flex flex-col items-center p-2 h-auto hover:bg-accent transition-all duration-200 hover:scale-105'
							>
								<Link href='/add'>
									<div className='w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center mb-1 shadow-lg'>
										<TrendingDown className='w-5 h-5 text-white' />
									</div>
									<span className='text-xs font-medium text-rose-700'>
										Chi tiêu
									</span>
								</Link>
							</Button>

							<Button
								asChild
								variant='ghost'
								className='flex flex-col items-center p-2 h-auto hover:bg-accent transition-all duration-200 hover:scale-105'
							>
								<Link href='/transfer'>
									<div className='w-10 h-10 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center mb-1 shadow-lg'>
										<ArrowLeftRight className='w-5 h-5 text-white' />
									</div>
									<span className='text-xs font-medium text-violet-700'>
										Chuyển khoản
									</span>
								</Link>
							</Button>

							{/* Row 2 */}
							<Button
								asChild
								variant='ghost'
								className='flex flex-col items-center p-2 h-auto hover:bg-accent transition-all duration-200 hover:scale-105'
							>
								<Link href='/wallet'>
									<div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-1 shadow-lg'>
										<Wallet className='w-5 h-5 text-white' />
									</div>
									<span className='text-xs font-medium text-blue-700'>Ví</span>
								</Link>
							</Button>

							<Button
								asChild
								variant='ghost'
								className='flex flex-col items-center p-2 h-auto hover:bg-accent transition-all duration-200 hover:scale-105'
							>
								<Link href='/add'>
									<div className='w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mb-1 shadow-lg'>
										<Tag className='w-5 h-5 text-white' />
									</div>
									<span className='text-xs font-medium text-cyan-700'>
										Danh mục
									</span>
								</Link>
							</Button>

							<Button
								asChild
								variant='ghost'
								className='flex flex-col items-center p-2 h-auto hover:bg-accent transition-all duration-200 hover:scale-105'
							>
								<Link href='/reports'>
									<div className='w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-1 shadow-lg'>
										<BarChart3 className='w-5 h-5 text-white' />
									</div>
									<span className='text-xs font-medium text-orange-700'>
										Báo cáo
									</span>
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Transactions */}
			<div className='p-4'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-lg font-semibold'>Giao dịch gần đây</h2>
					<Button variant='link' className='text-primary p-0 h-auto'>
						Xem tất cả
					</Button>
				</div>

				<Card>
					<CardContent className='p-0'>
						<div className='divide-y divide-border'>
							<div className='p-4 flex justify-between items-center'>
								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
										<span className='text-red-600 text-sm'>🍔</span>
									</div>
									<div>
										<p className='font-medium'>Ăn trưa</p>
										<p className='text-sm text-muted-foreground'>
											Hôm nay, 12:30
										</p>
									</div>
								</div>
								<Badge variant='destructive' className='font-semibold'>
									-85,000 VNĐ
								</Badge>
							</div>

							<div className='p-4 flex justify-between items-center'>
								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
										<span className='text-blue-600 text-sm'>⛽</span>
									</div>
									<div>
										<p className='font-medium'>Xăng xe</p>
										<p className='text-sm text-muted-foreground'>
											Hôm qua, 8:00
										</p>
									</div>
								</div>
								<Badge variant='destructive' className='font-semibold'>
									-200,000 VNĐ
								</Badge>
							</div>

							<div className='p-4 flex justify-between items-center'>
								<div className='flex items-center space-x-3'>
									<div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
										<span className='text-green-600 text-sm'>💰</span>
									</div>
									<div>
										<p className='font-medium'>Lương tháng 12</p>
										<p className='text-sm text-muted-foreground'>1/12/2024</p>
									</div>
								</div>
								<Badge
									variant='default'
									className='font-semibold bg-green-600 hover:bg-green-700'
								>
									+15,000,000 VNĐ
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
