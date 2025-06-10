import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		// For demo purposes, using the demo user
		// In real app, get userId from session/auth
		const userId = '14af0328-525a-4346-aa63-579daee01fab'; // Demo user ID

		// Get user's wallets with total balance
		const wallets = await prisma.wallet.findMany({
			where: {
				userId: userId,
				isActive: true,
			},
			include: {
				type: true,
			},
		});

		// Calculate total balance
		const totalBalance = wallets.reduce((sum, wallet) => {
			return sum + Number(wallet.currentBalance);
		}, 0);

		// Get recent transactions (last 5)
		const recentTransactions = await prisma.transaction.findMany({
			where: {
				userId: userId,
			},
			include: {
				category: true,
				wallet: true,
			},
			orderBy: {
				transactionDate: 'desc',
			},
			take: 5,
		});

		// Format transactions for UI
		const formattedTransactions = recentTransactions.map((transaction) => ({
			id: transaction.id,
			type: transaction.type,
			amount: Number(transaction.amount),
			category: {
				name: transaction.category?.name || 'Khác',
				icon: transaction.category?.icon || '📦',
				color: transaction.category?.color || 'gray',
			},
			wallet: transaction.wallet.name,
			description: transaction.description,
			date: transaction.transactionDate,
			time: transaction.transactionDate.toLocaleTimeString('vi-VN', {
				hour: '2-digit',
				minute: '2-digit',
			}),
		}));

		return NextResponse.json({
			success: true,
			data: {
				totalBalance,
				wallets: wallets.map((wallet) => ({
					id: wallet.id,
					name: wallet.name,
					type: wallet.type.name,
					balance: Number(wallet.currentBalance),
					icon: wallet.type.icon,
				})),
				recentTransactions: formattedTransactions,
				summary: {
					totalWallets: wallets.length,
					totalTransactions: recentTransactions.length,
				},
			},
		});
	} catch (error) {
		console.error('Dashboard API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch dashboard data',
			},
			{ status: 500 },
		);
	}
}
