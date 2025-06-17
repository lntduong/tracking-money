'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';

export function AuthButton() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return (
			<Button variant='ghost' size='sm' disabled>
				<User className='w-4 h-4 mr-2' />
				...
			</Button>
		);
	}

	if (session?.user) {
		return (
			<div className='flex items-center gap-2'>
				<span className='text-sm text-gray-600 hidden sm:inline'>
					{session.user.name || session.user.email}
				</span>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => signOut({ callbackUrl: '/auth/signin' })}
					className='text-red-600 hover:text-red-700 hover:bg-red-50'
				>
					<LogOut className='w-4 h-4 mr-2' />
					Đăng xuất
				</Button>
			</div>
		);
	}

	return (
		<Button asChild variant='ghost' size='sm'>
			<Link href='/auth/signin'>
				<LogIn className='w-4 h-4 mr-2' />
				Đăng nhập
			</Link>
		</Button>
	);
}
