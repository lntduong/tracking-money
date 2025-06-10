import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CategorySelect } from '@/components/CategorySelect';

export default function AddPage() {
	return (
		<div className='p-4 safe-area-top bg-muted/50 min-h-screen'>
			<h1 className='text-2xl font-bold mb-6'>Thêm giao dịch</h1>

			<div className='space-y-6'>
				{/* Loại giao dịch */}
				<Card>
					<CardContent className='p-4'>
						<div className='flex gap-2'>
							<Button variant='destructive' className='flex-1 py-3'>
								Chi tiêu
							</Button>
							<Button variant='outline' className='flex-1 py-3'>
								Thu nhập
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle>Thông tin giao dịch</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='amount' className='text-base font-medium'>
								Số tiền
							</Label>
							<Input
								id='amount'
								type='text'
								inputMode='numeric'
								placeholder='0'
								className='text-2xl text-center border-2 focus:border-primary'
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='category' className='text-base font-medium'>
								Danh mục
							</Label>
							<CategorySelect
								className='h-12 w-full'
								placeholder='Chọn danh mục chi tiêu'
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='note' className='text-base font-medium'>
								Ghi chú
							</Label>
							<Input
								id='note'
								type='text'
								placeholder='Nhập ghi chú...'
								className='h-10'
							/>
						</div>
					</CardContent>
				</Card>

				<Button size='lg' className='w-full h-12 text-lg font-semibold'>
					Lưu giao dịch
				</Button>
			</div>
		</div>
	);
}
