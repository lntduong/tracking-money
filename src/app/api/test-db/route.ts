import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		// Test database connection
		const walletTypes = await prisma.walletType.findMany();
		const categories = await prisma.category.findMany({
			where: { isDefault: true },
		});
		const demoUser = await prisma.user.findUnique({
			where: { email: 'demo@moneytracking.app' },
			include: {
				wallets: {
					include: { type: true },
				},
				settings: true,
			},
		});

		return NextResponse.json({
			success: true,
			data: {
				walletTypes: walletTypes.length,
				categories: categories.length,
				demoUser: demoUser
					? {
							name: demoUser.fullName,
							email: demoUser.email,
							isPremium: demoUser.isPremium,
							wallets: demoUser.wallets.map((w: any) => ({
								name: w.name,
								type: w.type.name,
								balance: w.currentBalance,
							})),
							settings: demoUser.settings,
					  }
					: null,
			},
		});
	} catch (error) {
		console.error('Database test error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Database connection failed',
			},
			{ status: 500 },
		);
	}
}
