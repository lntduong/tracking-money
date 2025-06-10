import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WalletPage() {
	return (
		<div className='p-4 safe-area-top bg-muted/50 min-h-screen'>
			<h1 className='text-2xl font-bold mb-6'>Ví của tôi</h1>
			<div className='space-y-4'>
				<Card>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<span>Ví chính</span>
							<Badge
								variant='default'
								className='bg-green-600 hover:bg-green-700'
							>
								Chính
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold text-green-600'>1,250,000 VNĐ</p>
						<p className='text-sm text-muted-foreground mt-2'>
							Cập nhật: Hôm nay, 14:30
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<span>Thẻ tín dụng</span>
							<Badge variant='secondary'>Tín dụng</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold text-blue-600'>5,000,000 VNĐ</p>
						<p className='text-sm text-muted-foreground mt-2'>
							Hạn mức khả dụng • Kỳ hạn: 15/01/2025
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className='flex justify-between items-center'>
							<span>Tài khoản tiết kiệm</span>
							<Badge variant='outline'>Tiết kiệm</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold text-purple-600'>12,500,000 VNĐ</p>
						<p className='text-sm text-muted-foreground mt-2'>
							Lãi suất: 6.5%/năm • Kỳ hạn: 12 tháng
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
