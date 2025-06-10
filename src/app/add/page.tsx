export default function AddPage() {
	return (
		<div className='p-4 safe-area-top'>
			<h1 className='text-2xl font-bold mb-6'>Thêm giao dịch</h1>

			<div className='space-y-6'>
				{/* Loại giao dịch */}
				<div className='flex gap-2'>
					<button className='flex-1 py-3 px-4 bg-red-100 text-red-700 rounded-lg font-medium'>
						Chi tiêu
					</button>
					<button className='flex-1 py-3 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium'>
						Thu nhập
					</button>
				</div>

				{/* Form */}
				<div className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Số tiền
						</label>
						<input
							type='text'
							inputMode='numeric'
							placeholder='0'
							className='w-full p-4 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Danh mục
						</label>
						<select className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
							<option>Ăn uống</option>
							<option>Đi lại</option>
							<option>Mua sắm</option>
							<option>Giải trí</option>
						</select>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Ghi chú
						</label>
						<input
							type='text'
							placeholder='Nhập ghi chú...'
							className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
					</div>
				</div>

				<button className='w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors'>
					Lưu giao dịch
				</button>
			</div>
		</div>
	);
}
