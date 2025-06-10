import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeftRight, Eye, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function WalletPage() {
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
							>
								<Eye className='w-5 h-5' />
							</Button>
							<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
								<Wallet className='w-5 h-5' />
							</div>
						</div>
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
				<h2 className='text-lg font-semibold text-slate-700'>Danh sách ví</h2>

				<Card className='bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200/50'>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center'>
									<Wallet className='w-5 h-5 text-white' />
								</div>
								<span className='text-slate-800'>Ví chính</span>
							</div>
							<Badge
								variant='default'
								className='bg-emerald-600 hover:bg-emerald-700'
							>
								Chính
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold text-emerald-700'>1,250,000 VNĐ</p>
						<p className='text-sm text-emerald-600 mt-2'>
							Cập nhật: Hôm nay, 14:30
						</p>
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50'>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
									<span className='text-white text-sm'>💳</span>
								</div>
								<span className='text-slate-800'>Thẻ tín dụng</span>
							</div>
							<Badge
								variant='secondary'
								className='bg-blue-100 text-blue-700 border-blue-200'
							>
								Tín dụng
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold text-blue-700'>5,000,000 VNĐ</p>
						<p className='text-sm text-blue-600 mt-2'>
							Hạn mức khả dụng • Kỳ hạn: 15/01/2025
						</p>
					</CardContent>
				</Card>

				<Card className='bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50'>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center'>
									<span className='text-white text-sm'>💰</span>
								</div>
								<span className='text-slate-800'>Tài khoản tiết kiệm</span>
							</div>
							<Badge
								variant='outline'
								className='border-purple-300 text-purple-700'
							>
								Tiết kiệm
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold text-purple-700'>12,500,000 VNĐ</p>
						<p className='text-sm text-purple-600 mt-2'>
							Lãi suất: 6.5%/năm • Kỳ hạn: 12 tháng
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
