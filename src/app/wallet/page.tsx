export default function WalletPage() {
	return (
		<div className='p-4 safe-area-top'>
			<h1 className='text-2xl font-bold mb-4'>Ví của tôi</h1>
			<div className='space-y-4'>
				<div className='bg-white rounded-lg p-4 shadow-sm border'>
					<h2 className='text-lg font-semibold text-gray-900'>Ví chính</h2>
					<p className='text-2xl font-bold text-green-600 mt-2'>
						1,250,000 VNĐ
					</p>
				</div>
				<div className='bg-white rounded-lg p-4 shadow-sm border'>
					<h2 className='text-lg font-semibold text-gray-900'>Thẻ tín dụng</h2>
					<p className='text-2xl font-bold text-blue-600 mt-2'>5,000,000 VNĐ</p>
				</div>
			</div>
		</div>
	);
}
