import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ReportsPage() {
	return (
		<div className='p-4 safe-area-top bg-muted/50 min-h-screen'>
			<h1 className='text-2xl font-bold mb-6'>Báo cáo</h1>

			<div className='space-y-6'>
				{/* Tổng quan tháng này */}
				<Card>
					<CardHeader>
						<CardTitle>Tháng này</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 gap-4'>
							<div className='text-center'>
								<p className='text-sm text-muted-foreground'>Thu nhập</p>
								<Badge
									variant='default'
									className='text-lg font-bold bg-green-600 hover:bg-green-700 px-3 py-1 mt-1'
								>
									+15,000,000 VNĐ
								</Badge>
							</div>
							<div className='text-center'>
								<p className='text-sm text-muted-foreground'>Chi tiêu</p>
								<Badge
									variant='destructive'
									className='text-lg font-bold px-3 py-1 mt-1'
								>
									-8,750,000 VNĐ
								</Badge>
							</div>
						</div>
						<Separator className='my-4' />
						<div className='text-center'>
							<p className='text-sm text-muted-foreground'>Tiết kiệm</p>
							<Badge
								variant='outline'
								className='text-2xl font-bold border-blue-600 text-blue-600 px-4 py-2 mt-2'
							>
								+6,250,000 VNĐ
							</Badge>
						</div>
					</CardContent>
				</Card>

				{/* Chi tiêu theo danh mục */}
				<Card>
					<CardHeader>
						<CardTitle>Chi tiêu theo danh mục</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							<div className='flex justify-between items-center'>
								<div className='flex items-center space-x-3'>
									<div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center'>
										<span className='text-orange-600'>🍔</span>
									</div>
									<span className='font-medium'>Ăn uống</span>
								</div>
								<Badge variant='outline' className='font-semibold'>
									3,200,000 VNĐ
								</Badge>
							</div>

							<Separator />

							<div className='flex justify-between items-center'>
								<div className='flex items-center space-x-3'>
									<div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
										<span className='text-blue-600'>🚗</span>
									</div>
									<span className='font-medium'>Đi lại</span>
								</div>
								<Badge variant='outline' className='font-semibold'>
									1,500,000 VNĐ
								</Badge>
							</div>

							<Separator />

							<div className='flex justify-between items-center'>
								<div className='flex items-center space-x-3'>
									<div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
										<span className='text-purple-600'>🛍️</span>
									</div>
									<span className='font-medium'>Mua sắm</span>
								</div>
								<Badge variant='outline' className='font-semibold'>
									2,800,000 VNĐ
								</Badge>
							</div>

							<Separator />

							<div className='flex justify-between items-center'>
								<div className='flex items-center space-x-3'>
									<div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
										<span className='text-green-600'>🎮</span>
									</div>
									<span className='font-medium'>Giải trí</span>
								</div>
								<Badge variant='outline' className='font-semibold'>
									1,250,000 VNĐ
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
