import { Settings, User, Bell, HelpCircle, LogOut } from 'lucide-react';

export default function AccountPage() {
	return (
		<div className='p-4 safe-area-top'>
			<h1 className='text-2xl font-bold mb-6'>Tài khoản</h1>

			<div className='space-y-6'>
				{/* User Profile */}
				<div className='bg-white rounded-lg p-4 shadow-sm border'>
					<div className='flex items-center space-x-4'>
						<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
							<User className='w-8 h-8 text-blue-600' />
						</div>
						<div>
							<h2 className='text-xl font-semibold'>Nguyễn Văn A</h2>
							<p className='text-gray-600'>nguyenvana@example.com</p>
						</div>
					</div>
				</div>

				{/* Menu Items */}
				<div className='bg-white rounded-lg shadow-sm border'>
					<div className='divide-y divide-gray-100'>
						<div className='flex items-center justify-between p-4 hover:bg-gray-50'>
							<div className='flex items-center space-x-3'>
								<Settings className='w-5 h-5 text-gray-500' />
								<span className='font-medium'>Cài đặt</span>
							</div>
							<span className='text-gray-400'>›</span>
						</div>

						<div className='flex items-center justify-between p-4 hover:bg-gray-50'>
							<div className='flex items-center space-x-3'>
								<Bell className='w-5 h-5 text-gray-500' />
								<span className='font-medium'>Thông báo</span>
							</div>
							<span className='text-gray-400'>›</span>
						</div>

						<div className='flex items-center justify-between p-4 hover:bg-gray-50'>
							<div className='flex items-center space-x-3'>
								<HelpCircle className='w-5 h-5 text-gray-500' />
								<span className='font-medium'>Trợ giúp</span>
							</div>
							<span className='text-gray-400'>›</span>
						</div>
					</div>
				</div>

				{/* Logout */}
				<div className='bg-white rounded-lg shadow-sm border'>
					<div className='flex items-center justify-between p-4 hover:bg-gray-50'>
						<div className='flex items-center space-x-3'>
							<LogOut className='w-5 h-5 text-red-500' />
							<span className='font-medium text-red-500'>Đăng xuất</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
