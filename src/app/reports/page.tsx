export default function ReportsPage() {
	return (
		<div className='p-4 safe-area-top'>
			<h1 className='text-2xl font-bold mb-6'>Báo cáo</h1>

			<div className='space-y-6'>
				{/* Tổng quan tháng này */}
				<div className='bg-white rounded-lg p-4 shadow-sm border'>
					<h2 className='text-lg font-semibold mb-4'>Tháng này</h2>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<p className='text-sm text-gray-600'>Thu nhập</p>
							<p className='text-xl font-bold text-green-600'>
								+15,000,000 VNĐ
							</p>
						</div>
						<div>
							<p className='text-sm text-gray-600'>Chi tiêu</p>
							<p className='text-xl font-bold text-red-600'>-8,750,000 VNĐ</p>
						</div>
					</div>
					<div className='mt-4 pt-4 border-t'>
						<p className='text-sm text-gray-600'>Tiết kiệm</p>
						<p className='text-2xl font-bold text-blue-600'>+6,250,000 VNĐ</p>
					</div>
				</div>

				{/* Chi tiêu theo danh mục */}
				<div className='bg-white rounded-lg p-4 shadow-sm border'>
					<h2 className='text-lg font-semibold mb-4'>Chi tiêu theo danh mục</h2>
					<div className='space-y-3'>
						<div className='flex justify-between items-center'>
							<span className='text-gray-700'>Ăn uống</span>
							<span className='font-semibold'>3,200,000 VNĐ</span>
						</div>
						<div className='flex justify-between items-center'>
							<span className='text-gray-700'>Đi lại</span>
							<span className='font-semibold'>1,500,000 VNĐ</span>
						</div>
						<div className='flex justify-between items-center'>
							<span className='text-gray-700'>Mua sắm</span>
							<span className='font-semibold'>2,800,000 VNĐ</span>
						</div>
						<div className='flex justify-between items-center'>
							<span className='text-gray-700'>Giải trí</span>
							<span className='font-semibold'>1,250,000 VNĐ</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
