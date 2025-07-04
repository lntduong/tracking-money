import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { Prisma } from '@prisma/client';

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json(
				{ success: false, error: 'Unauthorized' },
				{ status: 401 },
			);
		}
		const userId = session.user.id;
		const { type, amount, categoryId, walletId, description, transactionDate } =
			await request.json();

		// Validate input
		if (!type || !['income', 'expense'].includes(type)) {
			return NextResponse.json(
				{ success: false, error: 'Loại giao dịch không hợp lệ' },
				{ status: 400 },
			);
		}
		if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
			return NextResponse.json(
				{ success: false, error: 'Số tiền không hợp lệ' },
				{ status: 400 },
			);
		}
		if (!categoryId || !walletId) {
			return NextResponse.json(
				{ success: false, error: 'Thiếu danh mục hoặc ví' },
				{ status: 400 },
			);
		}

		// Kiểm tra ví hợp lệ
		const wallet = await prisma.wallet.findFirst({
			where: { id: walletId, userId, isActive: true },
		});
		if (!wallet) {
			return NextResponse.json(
				{ success: false, error: 'Ví không hợp lệ' },
				{ status: 404 },
			);
		}

		// Nếu là chi tiêu, kiểm tra số dư
		if (type === 'expense' && Number(wallet.currentBalance) < Number(amount)) {
			return NextResponse.json(
				{ success: false, error: 'Số dư ví không đủ' },
				{ status: 400 },
			);
		}

		// Thực hiện transaction: cập nhật số dư ví và lưu giao dịch
		const transaction = await prisma.$transaction(
			async (tx: Prisma.TransactionClient) => {
				// Cập nhật số dư ví
				await tx.wallet.update({
					where: { id: walletId },
					data: {
						currentBalance:
							type === 'income'
								? { increment: Number(amount) }
								: { decrement: Number(amount) },
					},
				});
				// Lưu giao dịch
				const newTransaction = await tx.transaction.create({
					data: {
						userId,
						walletId,
						categoryId,
						type,
						amount: Number(amount),
						description: description || '',
						transactionDate: transactionDate
							? new Date(transactionDate)
							: new Date(),
					},
				});
				return newTransaction;
			},
		);

		return NextResponse.json({ success: true, data: transaction });
	} catch (error) {
		console.error('Transaction API error:', error);
		return NextResponse.json(
			{ success: false, error: 'Thêm giao dịch thất bại' },
			{ status: 500 },
		);
	}
}
