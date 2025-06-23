'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

type CategoryBreakdown = {
	name: string;
	icon: string;
	color: string;
	amount: number;
	count: number;
	percentage: number;
};

export default function ReportsPage() {
	const [reportData, setReportData] = useState<{
		categoryBreakdown: CategoryBreakdown[];
	} | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchReport() {
			try {
				const res = await fetch('/api/reports');
				const result = await res.json();
				if (result.success) setReportData(result.data);
			} finally {
				setLoading(false);
			}
		}
		fetchReport();
	}, []);

	return (
		<div className='min-h-screen bg-muted/50 safe-area-top'>
			{/* Header */}
			<div className='bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				{/* Background decoration */}
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				{/* Header content */}
				<div className='relative z-10'>
					<div className='flex justify-between items-center mb-6'>
						<div>
							<p className='text-white/70 text-sm font-medium'>
								Phân tích tài chính
							</p>
							<h1 className='text-2xl font-bold mt-1'>Báo cáo</h1>
						</div>
						<div className='flex items-center gap-3'>
							<Button
								variant='ghost'
								size='icon'
								className='text-white hover:bg-white/20 h-10 w-10'
							>
								<PieChart className='w-5 h-5' />
							</Button>
							<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
								<BarChart3 className='w-5 h-5' />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='p-4 space-y-6'>
				{/* Tổng quan tháng này */}
				<Card className='bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg'>
					<CardHeader className='pb-3'>
						<CardTitle className='flex items-center space-x-2'>
							<PieChart className='h-5 w-5 text-orange-600' />
							<span>Tổng quan tháng này</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 gap-3'>
							<div className='bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-2xl border border-emerald-100'>
								<div className='flex justify-center mb-3'>
									<TrendingUp className='h-7 w-7 text-emerald-600' />
								</div>
								<p className='text-center text-sm text-emerald-700 font-medium mb-3'>
									Thu nhập
								</p>
								<div className='flex justify-center'>
									<div className='bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-base'>
										+15,000,000
									</div>
								</div>
							</div>
							<div className='bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-2xl border border-rose-100'>
								<div className='flex justify-center mb-3'>
									<TrendingDown className='h-7 w-7 text-rose-600' />
								</div>
								<p className='text-center text-sm text-rose-700 font-medium mb-3'>
									Chi tiêu
								</p>
								<div className='flex justify-center'>
									<div className='bg-rose-600 text-white px-4 py-2 rounded-xl font-bold text-base'>
										-8,750,000
									</div>
								</div>
							</div>
						</div>
						<Separator className='my-6' />
						<div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100'>
							<p className='text-center text-sm text-blue-700 font-medium mb-3'>
								Tiết kiệm trong tháng
							</p>
							<div className='flex justify-center'>
								<div className='bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xl'>
									+6,250,000 VNĐ
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Chi tiêu theo danh mục */}
				<Card className='bg-gradient-to-br from-white to-amber-50 border-0 shadow-lg'>
					<CardHeader className='pb-3'>
						<CardTitle className='flex items-center space-x-2'>
							<PieChart className='h-5 w-5 text-amber-600' />
							<span>Chi tiêu theo danh mục</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className='p-8 text-center'>Đang tải...</div>
						) : reportData?.categoryBreakdown?.length ? (
							<div className='space-y-5'>
								{reportData.categoryBreakdown.map((cat: CategoryBreakdown) => (
									<div className='space-y-2' key={cat.name}>
										<div className='flex justify-between items-center'>
											<div className='flex items-center space-x-3'>
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center border`}
													style={{ background: `var(--cat-bg-${cat.color})` }}
												>
													<span className='text-lg'>{cat.icon}</span>
												</div>
												<div>
													<span className='font-semibold text-gray-900'>
														{cat.name}
													</span>
													<p className='text-xs text-gray-500'>
														{cat.percentage.toFixed(1)}% tổng chi tiêu
													</p>
												</div>
											</div>
											<Badge variant='outline' className={`font-bold border`}>
												{cat.amount.toLocaleString('vi-VN')} VNĐ
											</Badge>
										</div>
										<Progress value={cat.percentage} className='h-2' />
									</div>
								))}
							</div>
						) : (
							<div className='p-8 text-center text-muted-foreground'>
								Không có dữ liệu
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
