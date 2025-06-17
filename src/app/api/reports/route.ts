import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{
					success: false,
					error: 'Unauthorized',
				},
				{ status: 401 },
			);
		}

		const userId = session.user.id;
		const { searchParams } = new URL(request.url);
		const period = searchParams.get('period') || 'month'; // 'week' | 'month' | 'year'

		// Calculate date range based on period
		const now = new Date();
		let startDate: Date;

		switch (period) {
			case 'week':
				startDate = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() - 7,
				);
				break;
			case 'year':
				startDate = new Date(now.getFullYear(), 0, 1);
				break;
			case 'month':
			default:
				startDate = new Date(now.getFullYear(), now.getMonth(), 1);
				break;
		}

		// Get transactions for the period
		const transactions = await prisma.transaction.findMany({
			where: {
				userId: userId,
				transactionDate: {
					gte: startDate,
					lte: now,
				},
			},
			include: {
				category: true,
				wallet: {
					include: {
						type: true,
					},
				},
			},
			orderBy: {
				transactionDate: 'desc',
			},
		});

		// Calculate summary statistics
		const income = transactions
			.filter((t) => t.type === 'income')
			.reduce((sum, t) => sum + Number(t.amount), 0);

		const expenses = transactions
			.filter((t) => t.type === 'expense')
			.reduce((sum, t) => sum + Number(t.amount), 0);

		const savings = income - expenses;

		// Group expenses by category
		const expensesByCategory = transactions
			.filter((t) => t.type === 'expense' && t.category)
			.reduce((acc, t) => {
				const categoryName = t.category!.name;
				const categoryIcon = t.category!.icon;
				const categoryColor = t.category!.color;

				if (!acc[categoryName]) {
					acc[categoryName] = {
						name: categoryName,
						icon: categoryIcon,
						color: categoryColor,
						amount: 0,
						count: 0,
					};
				}

				acc[categoryName].amount += Number(t.amount);
				acc[categoryName].count += 1;

				return acc;
			}, {} as Record<string, { name: string; icon: string; color: string; amount: number; count: number }>);

		// Convert to array and sort by amount
		const categoryBreakdown = Object.values(expensesByCategory)
			.sort((a, b) => b.amount - a.amount)
			.map((cat) => ({
				...cat,
				percentage: expenses > 0 ? (cat.amount / expenses) * 100 : 0,
			}));

		// Group expenses by wallet
		const expensesByWallet = transactions
			.filter((t) => t.type === 'expense')
			.reduce((acc, t) => {
				const walletName = t.wallet.name;
				const walletType = t.wallet.type.name;
				const walletIcon = t.wallet.type.icon;

				if (!acc[walletName]) {
					acc[walletName] = {
						name: walletName,
						type: walletType,
						icon: walletIcon,
						amount: 0,
						count: 0,
					};
				}

				acc[walletName].amount += Number(t.amount);
				acc[walletName].count += 1;

				return acc;
			}, {} as Record<string, { name: string; type: string; icon: string; amount: number; count: number }>);

		const walletBreakdown = Object.values(expensesByWallet).sort(
			(a, b) => b.amount - a.amount,
		);

		// Daily trend for the period
		const dailyTrend = transactions.reduce((acc, t) => {
			const date = t.transactionDate.toISOString().split('T')[0];

			if (!acc[date]) {
				acc[date] = { date, income: 0, expenses: 0 };
			}

			if (t.type === 'income') {
				acc[date].income += Number(t.amount);
			} else {
				acc[date].expenses += Number(t.amount);
			}

			return acc;
		}, {} as Record<string, { date: string; income: number; expenses: number }>);

		const trendData = Object.values(dailyTrend).sort((a, b) =>
			a.date.localeCompare(b.date),
		);

		// Recent transactions (last 10)
		const recentTransactions = transactions.slice(0, 10).map((t) => ({
			id: t.id,
			type: t.type,
			amount: Number(t.amount),
			description: t.description,
			date: t.transactionDate,
			category: t.category
				? {
						name: t.category.name,
						icon: t.category.icon,
						color: t.category.color,
				  }
				: null,
			wallet: {
				name: t.wallet.name,
				type: t.wallet.type.name,
				icon: t.wallet.type.icon,
			},
		}));

		return NextResponse.json({
			success: true,
			data: {
				period,
				summary: {
					income,
					expenses,
					savings,
					transactionCount: transactions.length,
				},
				categoryBreakdown,
				walletBreakdown,
				trendData,
				recentTransactions,
				dateRange: {
					startDate: startDate.toISOString(),
					endDate: now.toISOString(),
				},
			},
		});
	} catch (error) {
		console.error('Reports API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch reports data',
			},
			{ status: 500 },
		);
	}
}
