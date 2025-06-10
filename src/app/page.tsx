import { Eye, Plus } from 'lucide-react';

export default function HomePage() {
	return (
		<div className='min-h-screen bg-gray-50 safe-area-top'>
			{/* Header */}
			<div className='bg-blue-600 text-white p-4 rounded-b-3xl'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-xl font-semibold'>Xin chào, Nguyễn Văn A</h1>
					<Eye className='w-6 h-6' />
				</div>

				{/* Balance Card */}
				<div className='bg-white/10 backdrop-blur-sm rounded-2xl p-4'>
					<p className='text-blue-100 text-sm'>Tổng số dư</p>
					<p className='text-3xl font-bold mt-1'>6,250,000 VNĐ</p>
					<div className='flex justify-between mt-4 text-sm'>
						<div>
							<p className='text-blue-100'>Thu nhập tháng này</p>
							<p className='font-semibold'>+15,000,000 VNĐ</p>
						</div>
						<div>
							<p className='text-blue-100'>Chi tiêu tháng này</p>
							<p className='font-semibold'>-8,750,000 VNĐ</p>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className='p-4 -mt-6'>
				<div className='bg-white rounded-2xl shadow-sm p-4'>
					<div className='grid grid-cols-3 gap-4'>
						<button className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-xl'>
							<div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2'>
								<Plus className='w-6 h-6 text-green-600' />
							</div>
							<span className='text-sm font-medium'>Thu nhập</span>
						</button>

						<button className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-xl'>
							<div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2'>
								<Plus className='w-6 h-6 text-red-600' />
							</div>
							<span className='text-sm font-medium'>Chi tiêu</span>
						</button>

						<button className='flex flex-col items-center p-3 hover:bg-gray-50 rounded-xl'>
							<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2'>
								<Plus className='w-6 h-6 text-blue-600' />
							</div>
							<span className='text-sm font-medium'>Chuyển khoản</span>
						</button>
					</div>
				</div>
			</div>

			{/* Recent Transactions */}
			<div className='p-4'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-lg font-semibold'>Giao dịch gần đây</h2>
					<button className='text-blue-600 text-sm font-medium'>
						Xem tất cả
					</button>
				</div>

				<div className='bg-white rounded-2xl shadow-sm'>
					<div className='divide-y divide-gray-100'>
						<div className='p-4 flex justify-between items-center'>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
									<span className='text-red-600 text-sm'>🍔</span>
								</div>
								<div>
									<p className='font-medium'>Ăn trưa</p>
									<p className='text-sm text-gray-500'>Hôm nay, 12:30</p>
								</div>
							</div>
							<p className='font-semibold text-red-600'>-85,000 VNĐ</p>
						</div>

						<div className='p-4 flex justify-between items-center'>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
									<span className='text-blue-600 text-sm'>⛽</span>
								</div>
								<div>
									<p className='font-medium'>Xăng xe</p>
									<p className='text-sm text-gray-500'>Hôm qua, 8:00</p>
								</div>
							</div>
							<p className='font-semibold text-red-600'>-200,000 VNĐ</p>
						</div>

						<div className='p-4 flex justify-between items-center'>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center'>
									<span className='text-green-600 text-sm'>💰</span>
								</div>
								<div>
									<p className='font-medium'>Lương tháng 12</p>
									<p className='text-sm text-gray-500'>1/12/2024</p>
								</div>
							</div>
							<p className='font-semibold text-green-600'>+15,000,000 VNĐ</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
