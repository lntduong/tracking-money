import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
	request: Request,
	context: { params: { id: string } },
) {
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
		const { id: categoryId } = await Promise.resolve(context.params);

		// Check if category exists and belongs to user
		const category = await prisma.category.findFirst({
			where: {
				id: categoryId,
				userId: userId,
			},
		});

		if (!category) {
			return NextResponse.json(
				{
					success: false,
					error: 'Category not found or not authorized',
				},
				{ status: 404 },
			);
		}

		// Check if category is default
		if (category.isDefault) {
			return NextResponse.json(
				{
					success: false,
					error: 'Cannot delete default category',
				},
				{ status: 400 },
			);
		}

		// Delete category
		await prisma.category.delete({
			where: {
				id: categoryId,
			},
		});

		return NextResponse.json({
			success: true,
			message: 'Category deleted successfully',
		});
	} catch (error) {
		console.error('Delete category API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to delete category',
			},
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: Request,
	context: { params: { id: string } },
) {
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
		const { id: categoryId } = await Promise.resolve(context.params);
		const { name, icon, color } = await request.json();

		// Check if category exists and belongs to user
		const category = await prisma.category.findFirst({
			where: {
				id: categoryId,
				userId: userId,
			},
		});

		if (!category) {
			return NextResponse.json(
				{
					success: false,
					error: 'Category not found or not authorized',
				},
				{ status: 404 },
			);
		}

		// Check if category is default
		if (category.isDefault) {
			return NextResponse.json(
				{
					success: false,
					error: 'Cannot edit default category',
				},
				{ status: 400 },
			);
		}

		// Check if new name already exists for this user
		if (name !== category.name) {
			const existingCategory = await prisma.category.findFirst({
				where: {
					userId: userId,
					name: name,
					id: {
						not: categoryId,
					},
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
		}

		// Update category
		const updatedCategory = await prisma.category.update({
			where: {
				id: categoryId,
			},
			data: {
				name,
				icon,
				color,
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
			id: updatedCategory.id,
			name: updatedCategory.name,
			icon: updatedCategory.icon,
			color: updatedCategory.color,
			isDefault: updatedCategory.isDefault,
			transactionCount: updatedCategory._count.transactions,
		};

		return NextResponse.json({
			success: true,
			data: formattedCategory,
		});
	} catch (error) {
		console.error('Update category API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to update category',
			},
			{ status: 500 },
		);
	}
}
