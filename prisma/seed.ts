import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Seeding database...');

	// ================================================
	// WALLET TYPES SEED DATA
	// ================================================
	console.log('📦 Seeding wallet types...');

	const walletTypes = [
		{
			id: 'cash',
			name: 'Tiền mặt',
			icon: '💵',
			description: 'Tiền mặt cầm tay',
		},
		{
			id: 'bank',
			name: 'Tài khoản ngân hàng',
			icon: '🏦',
			description: 'Tài khoản ngân hàng thông thường',
		},
		{
			id: 'credit',
			name: 'Thẻ tín dụng',
			icon: '💳',
			description: 'Thẻ tín dụng và thẻ ghi nợ',
		},
		{
			id: 'savings',
			name: 'Tài khoản tiết kiệm',
			icon: '💰',
			description: 'Tài khoản tiết kiệm có lãi suất',
		},
		{
			id: 'ewallet',
			name: 'Ví điện tử',
			icon: '📱',
			description: 'Ví điện tử (MoMo, ZaloPay, ...)',
		},
		{
			id: 'investment',
			name: 'Tài khoản đầu tư',
			icon: '📈',
			description: 'Tài khoản đầu tư chứng khoán',
		},
	];

	for (const walletType of walletTypes) {
		await prisma.walletType.upsert({
			where: { id: walletType.id },
			update: {},
			create: walletType,
		});
	}

	console.log(`✅ Created ${walletTypes.length} wallet types`);

	// ================================================
	// DEFAULT CATEGORIES SEED DATA
	// ================================================
	console.log('🏷️ Seeding default categories...');

	const defaultCategories = [
		{
			name: 'Ăn uống',
			icon: '🍔',
			color: 'orange',
			isDefault: true,
			userId: null,
		},
		{
			name: 'Đi lại',
			icon: '🚗',
			color: 'blue',
			isDefault: true,
			userId: null,
		},
		{
			name: 'Mua sắm',
			icon: '🛍️',
			color: 'purple',
			isDefault: true,
			userId: null,
		},
		{
			name: 'Giải trí',
			icon: '🎮',
			color: 'green',
			isDefault: true,
			userId: null,
		},
		{
			name: 'Y tế',
			icon: '🏥',
			color: 'red',
			isDefault: true,
			userId: null,
		},
		{
			name: 'Tiện ích',
			icon: '⚡',
			color: 'yellow',
			isDefault: true,
			userId: null,
		},
		{
			name: 'Giáo dục',
			icon: '📚',
			color: 'indigo',
			isDefault: true,
			userId: null,
		},
		{
			name: 'Du lịch',
			icon: '✈️',
			color: 'teal',
			isDefault: true,
			userId: null,
		},
		{
			name: 'Tiết kiệm',
			icon: '💰',
			color: 'emerald',
			isDefault: true,
			userId: null,
		},
		{
			name: 'Khác',
			icon: '📦',
			color: 'gray',
			isDefault: true,
			userId: null,
		},
	];

	for (const category of defaultCategories) {
		// Check if category already exists
		const existingCategory = await prisma.category.findFirst({
			where: {
				name: category.name,
				isDefault: true,
				userId: null,
			},
		});

		if (!existingCategory) {
			await prisma.category.create({
				data: category,
			});
		}
	}

	console.log(`✅ Created ${defaultCategories.length} default categories`);

	// ================================================
	// DEMO USER (OPTIONAL)
	// ================================================
	console.log('👤 Creating demo user...');

	const demoUser = await prisma.user.upsert({
		where: { email: 'demo@moneytracking.app' },
		update: {},
		create: {
			email: 'demo@moneytracking.app',
			passwordHash: '$2a$10$8qz.demo.hash.for.testing.only', // bcrypt hash for 'demo123'
			fullName: 'Nguyễn Văn Demo',
			isPremium: true,
			settings: {
				create: {
					currency: 'VND',
					language: 'vi',
					timezone: 'Asia/Ho_Chi_Minh',
					notificationEnabled: true,
					emailNotifications: true,
					theme: 'light',
				},
			},
		},
	});

	console.log(`✅ Created demo user: ${demoUser.email}`);

	// ================================================
	// DEMO WALLETS
	// ================================================
	console.log('👛 Creating demo wallets...');

	const demoWallets = [
		{
			name: 'Ví chính',
			walletType: 'cash',
			initialBalance: 1250000,
			currentBalance: 1250000,
			description: 'Ví tiền mặt chính',
		},
		{
			name: 'Thẻ tín dụng',
			walletType: 'credit',
			initialBalance: 5000000,
			currentBalance: 5000000,
			description: 'Thẻ tín dụng Vietcombank',
		},
		{
			name: 'Tài khoản tiết kiệm',
			walletType: 'savings',
			initialBalance: 12500000,
			currentBalance: 12500000,
			description: 'Tài khoản tiết kiệm có kỳ hạn',
		},
	];

	for (const wallet of demoWallets) {
		const existingWallet = await prisma.wallet.findFirst({
			where: {
				userId: demoUser.id,
				name: wallet.name,
			},
		});

		if (!existingWallet) {
			await prisma.wallet.create({
				data: {
					...wallet,
					userId: demoUser.id,
				},
			});
		}
	}

	console.log(`✅ Created ${demoWallets.length} demo wallets`);

	// ================================================
	// DEMO TRANSACTIONS
	// ================================================
	console.log('💸 Creating demo transactions...');

	// Get default categories for transactions
	const foodCategory = await prisma.category.findFirst({
		where: { name: 'Ăn uống', isDefault: true },
	});
	const transportCategory = await prisma.category.findFirst({
		where: { name: 'Đi lại', isDefault: true },
	});
	const savingsCategory = await prisma.category.findFirst({
		where: { name: 'Tiết kiệm', isDefault: true },
	});

	// Get demo user wallets
	const cashWallet = await prisma.wallet.findFirst({
		where: { userId: demoUser.id, name: 'Ví chính' },
	});
	const creditWallet = await prisma.wallet.findFirst({
		where: { userId: demoUser.id, name: 'Thẻ tín dụng' },
	});

	const sampleTransactions = [
		{
			userId: demoUser.id,
			walletId: cashWallet?.id || '',
			categoryId: foodCategory?.id,
			type: 'expense',
			amount: 85000,
			description: 'Ăn trưa tại nhà hàng',
			transactionDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		},
		{
			userId: demoUser.id,
			walletId: creditWallet?.id || '',
			categoryId: transportCategory?.id,
			type: 'expense',
			amount: 200000,
			description: 'Xăng xe',
			transactionDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
		},
		{
			userId: demoUser.id,
			walletId: cashWallet?.id || '',
			categoryId: savingsCategory?.id,
			type: 'income',
			amount: 15000000,
			description: 'Lương tháng 12',
			transactionDate: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
		},
		{
			userId: demoUser.id,
			walletId: cashWallet?.id || '',
			categoryId: foodCategory?.id,
			type: 'expense',
			amount: 120000,
			description: 'Cà phê với bạn',
			transactionDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
		},
		{
			userId: demoUser.id,
			walletId: creditWallet?.id || '',
			categoryId: transportCategory?.id,
			type: 'expense',
			amount: 15000,
			description: 'Xe bus',
			transactionDate: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
		},
	];

	for (const transaction of sampleTransactions) {
		if (transaction.walletId) {
			const existingTransaction = await prisma.transaction.findFirst({
				where: {
					userId: transaction.userId,
					description: transaction.description,
					amount: transaction.amount,
				},
			});

			if (!existingTransaction) {
				await prisma.transaction.create({
					data: transaction as any,
				});
			}
		}
	}

	console.log(`✅ Created ${sampleTransactions.length} demo transactions`);

	console.log('🎉 Database seeding completed!');
}

main()
	.catch((e) => {
		console.error('❌ Error during seeding:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
