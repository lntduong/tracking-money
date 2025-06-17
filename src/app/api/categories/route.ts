import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
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

		// Get both default and user-specific categories
		const categories = await prisma.category.findMany({
			where: {
				OR: [{ isDefault: true }, { userId: userId }],
			},
			orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
			include: {
				_count: {
					select: {
						transactions: true,
					},
				},
			},
		});

		// Format response data
		const formattedCategories = categories.map((category) => ({
			id: category.id,
			name: category.name,
			icon: category.icon,
			color: category.color,
			isDefault: category.isDefault,
			transactionCount: category._count.transactions,
		}));

		return NextResponse.json({
			success: true,
			data: formattedCategories,
		});
	} catch (error) {
		console.error('Categories API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to fetch categories',
			},
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
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
		const { name, icon, color } = await request.json();

		// Check if category name already exists for this user
		const existingCategory = await prisma.category.findFirst({
			where: {
				userId: userId,
				name: name,
			},
		});

		if (existingCategory) {
			return NextResponse.json(
				{
					success: false,
					error: 'Category name already exists',
				},
				{ status: 400 },
			);
		}

		// Create new category
		const newCategory = await prisma.category.create({
			data: {
				userId,
				name,
				icon,
				color,
				isDefault: false,
			},
			include: {
				_count: {
					select: {
						transactions: true,
					},
				},
			},
		});

		// Format response data
		const formattedCategory = {
			id: newCategory.id,
			name: newCategory.name,
			icon: newCategory.icon,
			color: newCategory.color,
			isDefault: newCategory.isDefault,
			transactionCount: newCategory._count.transactions,
		};

		return NextResponse.json({
			success: true,
			data: formattedCategory,
		});
	} catch (error) {
		console.error('Create category API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to create category',
			},
			{ status: 500 },
		);
	}
}
