import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		// Get current session
		const session = await getServerSession(authOptions);
		console.log('Session:', session);

		if (!session?.user?.email) {
			console.log('No session or user email found');
			return NextResponse.json(
				{ success: false, error: 'Unauthorized' },
				{ status: 401 },
			);
		}

		const userEmail = session.user.email;
		console.log('User email from session:', userEmail);

		// Get user data with related counts
		const user = await prisma.user.findUnique({
			where: { email: userEmail },
			include: {
				_count: {
					select: {
						transactions: true,
						wallets: true,
					},
				},
			},
		});

		console.log('User data from database:', user);

		if (!user) {
			console.log('User not found in database');
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 },
			);
		}

		// Calculate days since member
		const memberSince = new Date(user.createdAt);
		const today = new Date();
		const daysSinceMember = Math.floor(
			(today.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24),
		);

		// Prepare response data
		const responseData = {
			success: true,
			data: {
				id: user.id,
				email: user.email,
				fullName: user.fullName,
				avatarUrl: user.avatarUrl,
				isPremium: user.isPremium,
				memberSince: user.createdAt,
				lastLogin: user.lastLogin,
				stats: {
					transactionCount: user._count.transactions,
					walletCount: user._count.wallets,
					daysSinceMember,
				},
			},
		};

		console.log('Response data:', responseData);
		return NextResponse.json(responseData);
	} catch (error) {
		console.error('Error in GET /api/account:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
