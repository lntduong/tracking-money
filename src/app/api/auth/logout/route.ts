import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
	try {
		const session = await getServerSession(authOptions);
		console.log('Logging out session:', session);

		// Return success response
		return NextResponse.json(
			{
				success: true,
				message: 'Logged out successfully',
			},
			{
				status: 200,
				headers: {
					'Set-Cookie': [
						'next-auth.session-token=; Path=/; HttpOnly; Max-Age=0',
						'next-auth.csrf-token=; Path=/; HttpOnly; Max-Age=0',
						'next-auth.callback-url=; Path=/; HttpOnly; Max-Age=0',
					].join(', '),
				},
			},
		);
	} catch (error) {
		console.error('Logout error:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to logout' },
			{ status: 500 },
		);
	}
}
