import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
		const { fromWalletId, toWalletId, amount, note } = await request.json();

		// Validate input
		if (!fromWalletId || !toWalletId || !amount || isNaN(Number(amount))) {
			return NextResponse.json(
				{ success: false, error: 'Thiếu thông tin chuyển khoản' },
				{ status: 400 },
			);
		}
		if (fromWalletId === toWalletId) {
			return NextResponse.json(
				{ success: false, error: 'Không thể chuyển giữa cùng một ví' },
				{ status: 400 },
			);
		}
		if (Number(amount) <= 0) {
			return NextResponse.json(
				{ success: false, error: 'Số tiền phải lớn hơn 0' },
				{ status: 400 },
			);
		}

		// Lấy thông tin ví nguồn và đích
		const [fromWallet, toWallet] = await Promise.all([
			prisma.wallet.findFirst({
				where: { id: fromWalletId, userId, isActive: true },
			}),
			prisma.wallet.findFirst({
				where: { id: toWalletId, userId, isActive: true },
			}),
		]);
		if (!fromWallet || !toWallet) {
			return NextResponse.json(
				{ success: false, error: 'Ví không hợp lệ' },
				{ status: 404 },
			);
		}
		if (Number(fromWallet.currentBalance) < Number(amount)) {
			return NextResponse.json(
				{ success: false, error: 'Số dư ví nguồn không đủ' },
				{ status: 400 },
			);
		}

		// Thực hiện chuyển khoản trong transaction
		const transfer = await prisma.$transaction(async (tx) => {
			// Trừ tiền ví nguồn
			await tx.wallet.update({
				where: { id: fromWalletId },
				data: { currentBalance: { decrement: Number(amount) } },
			});
			// Cộng tiền ví đích
			await tx.wallet.update({
				where: { id: toWalletId },
				data: { currentBalance: { increment: Number(amount) } },
			});
			// Lưu lịch sử chuyển khoản
			const newTransfer = await tx.transfer.create({
				data: {
					userId,
					fromWalletId,
					toWalletId,
					amount: Number(amount),
					note: note || '',
				},
			});
			return newTransfer;
		});

		return NextResponse.json({ success: true, data: transfer });
	} catch (error) {
		console.error('Transfer API error:', error);
		return NextResponse.json(
			{ success: false, error: 'Chuyển khoản thất bại' },
			{ status: 500 },
		);
	}
}
