import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ success: false, error: 'Unauthorized' },
				{ status: 401 },
			);
		}
		const userId = session.user.id;

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
		const totalBalance = wallets.reduce(
			(sum, wallet) =>
				sum +
				(wallet.currentBalance &&
				typeof wallet.currentBalance === 'object' &&
				'toNumber' in wallet.currentBalance
					? wallet.currentBalance.toNumber()
					: Number(wallet.currentBalance)),
			0,
		);

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
			amount:
				transaction.amount &&
				typeof transaction.amount === 'object' &&
				'toNumber' in transaction.amount
					? transaction.amount.toNumber()
					: Number(transaction.amount),
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

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				fullName: true,
				email: true,
				isPremium: true,
				avatarUrl: true,
				memberSince: true,
			},
		});

		// Tổng thu nhập
		const totalIncome = await prisma.transaction.aggregate({
			where: { userId, type: 'income' },
			_sum: { amount: true },
		});
		// Tổng chi tiêu
		const totalExpense = await prisma.transaction.aggregate({
			where: { userId, type: 'expense' },
			_sum: { amount: true },
		});

		return NextResponse.json({
			success: true,
			data: {
				totalBalance,
				wallets: wallets.map((wallet) => ({
					id: wallet.id,
					name: wallet.name,
					type: wallet.type.name,
					balance:
						wallet.currentBalance &&
						typeof wallet.currentBalance === 'object' &&
						'toNumber' in wallet.currentBalance
							? wallet.currentBalance.toNumber()
							: Number(wallet.currentBalance),
					icon: wallet.type.icon,
				})),
				recentTransactions: formattedTransactions,
				summary: {
					totalWallets: wallets.length,
					totalTransactions: recentTransactions.length,
					totalIncome: Number(totalIncome._sum.amount) || 0,
					totalExpense: Number(totalExpense._sum.amount) || 0,
				},
				user,
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
