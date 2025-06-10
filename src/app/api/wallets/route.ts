import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		// For demo purposes, using the demo user
		// In real app, get userId from session/auth
		const userId = '14af0328-525a-4346-aa63-579daee01fab'; // Demo user ID

		// Get user's wallets with transaction counts
		const wallets = await prisma.wallet.findMany({
			where: {
				userId: userId,
				isActive: true,
			},
			include: {
				type: true,
				_count: {
					select: { transactions: true },
				},
			},
			orderBy: { createdAt: 'asc' },
		});

		// Calculate total balance across all wallets
		const totalBalance = wallets.reduce((sum, wallet) => {
			return sum + Number(wallet.currentBalance);
		}, 0);

		// Format wallets for UI
		const formattedWallets = wallets.map((wallet) => ({
			id: wallet.id,
			name: wallet.name,
			type: {
				id: wallet.type.id,
				name: wallet.type.name,
				icon: wallet.type.icon,
				description: wallet.type.description,
			},
			balance: Number(wallet.currentBalance),
			transactionCount: wallet._count.transactions,
			description: wallet.description,
			isActive: wallet.isActive,
			createdAt: wallet.createdAt,
		}));

		return NextResponse.json({
			success: true,
			data: {
				wallets: formattedWallets,
				totalBalance,
				summary: {
					totalWallets: wallets.length,
					activeWallets: wallets.filter((w) => w.isActive).length,
				},
			},
		});
	} catch (error) {
		console.error('Wallets API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch wallets data',
			},
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const { name, walletType, initialBalance, description } =
			await request.json();
		const userId = '14af0328-525a-4346-aa63-579daee01fab'; // Demo user ID

		// Validate wallet type exists
		const typeExists = await prisma.walletType.findUnique({
			where: { id: walletType },
		});

		if (!typeExists) {
			return NextResponse.json(
				{
					success: false,
					error: 'Invalid wallet type',
				},
				{ status: 400 },
			);
		}

		// Create new wallet
		const newWallet = await prisma.wallet.create({
			data: {
				userId,
				name,
				walletType,
				initialBalance: parseFloat(initialBalance),
				currentBalance: parseFloat(initialBalance),
				description: description || null,
			},
			include: {
				type: true,
				_count: {
					select: { transactions: true },
				},
			},
		});

		return NextResponse.json({
			success: true,
			data: {
				id: newWallet.id,
				name: newWallet.name,
				type: {
					id: newWallet.type.id,
					name: newWallet.type.name,
					icon: newWallet.type.icon,
					description: newWallet.type.description,
				},
				balance: Number(newWallet.currentBalance),
				transactionCount: newWallet._count.transactions,
				description: newWallet.description,
				isActive: newWallet.isActive,
				createdAt: newWallet.createdAt,
			},
		});
	} catch (error) {
		console.error('Create wallet API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to create wallet',
			},
			{ status: 500 },
		);
	}
}
