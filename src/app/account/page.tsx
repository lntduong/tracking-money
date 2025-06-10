import { Settings, Bell, HelpCircle, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AccountPage() {
	return (
		<div className='p-4 safe-area-top bg-muted/50 min-h-screen'>
			<h1 className='text-2xl font-bold mb-6'>Tài khoản</h1>

			<div className='space-y-6'>
				{/* User Profile */}
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center space-x-4'>
							<Avatar className='w-16 h-16'>
								<AvatarFallback className='bg-primary text-primary-foreground text-xl font-semibold'>
									NV
								</AvatarFallback>
							</Avatar>
							<div>
								<h2 className='text-xl font-semibold'>Nguyễn Văn A</h2>
								<p className='text-muted-foreground'>nguyenvana@example.com</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Menu Items */}
				<Card>
					<CardContent className='p-0'>
						<div className='divide-y divide-border'>
							<Button
								variant='ghost'
								className='w-full justify-between h-auto p-4 rounded-none hover:bg-accent'
							>
								<div className='flex items-center space-x-3'>
									<Settings className='w-5 h-5 text-muted-foreground' />
									<span className='font-medium'>Cài đặt</span>
								</div>
								<span className='text-muted-foreground'>›</span>
							</Button>

							<Button
								variant='ghost'
								className='w-full justify-between h-auto p-4 rounded-none hover:bg-accent'
							>
								<div className='flex items-center space-x-3'>
									<Bell className='w-5 h-5 text-muted-foreground' />
									<span className='font-medium'>Thông báo</span>
								</div>
								<span className='text-muted-foreground'>›</span>
							</Button>

							<Button
								variant='ghost'
								className='w-full justify-between h-auto p-4 rounded-none hover:bg-accent'
							>
								<div className='flex items-center space-x-3'>
									<HelpCircle className='w-5 h-5 text-muted-foreground' />
									<span className='font-medium'>Trợ giúp</span>
								</div>
								<span className='text-muted-foreground'>›</span>
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Logout */}
				<Card>
					<CardContent className='p-0'>
						<Button
							variant='ghost'
							className='w-full justify-start h-auto p-4 text-destructive hover:bg-destructive/10 hover:text-destructive'
						>
							<div className='flex items-center space-x-3'>
								<LogOut className='w-5 h-5' />
								<span className='font-medium'>Đăng xuất</span>
							</div>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
