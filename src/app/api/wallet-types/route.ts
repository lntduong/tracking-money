import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		const walletTypes = await prisma.walletType.findMany({
			orderBy: { id: 'asc' },
		});

		return NextResponse.json({
			success: true,
			data: walletTypes,
		});
	} catch (error) {
		console.error('Wallet types API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch wallet types',
			},
			{ status: 500 },
		);
	}
}
