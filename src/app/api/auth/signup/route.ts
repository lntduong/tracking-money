import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
	try {
		const { email, password, fullName } = await request.json();

		// Validate required fields
		if (!email || !password || !fullName) {
			return NextResponse.json(
				{
					success: false,
					error: 'Email, password và họ tên là bắt buộc',
				},
				{ status: 400 },
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{
					success: false,
					error: 'Email không hợp lệ',
				},
				{ status: 400 },
			);
		}

		// Validate password strength
		if (password.length < 6) {
			return NextResponse.json(
				{
					success: false,
					error: 'Mật khẩu phải có ít nhất 6 ký tự',
				},
				{ status: 400 },
			);
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (existingUser) {
			return NextResponse.json(
				{
					success: false,
					error: 'Email này đã được sử dụng',
				},
				{ status: 400 },
			);
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 12);

		// Create new user
		const newUser = await prisma.user.create({
			data: {
				email: email.toLowerCase(),
				passwordHash,
				fullName: fullName.trim(),
			},
		});

		// Create default user settings
		await prisma.userSetting.create({
			data: {
				userId: newUser.id,
			},
		});

		return NextResponse.json({
			success: true,
			data: {
				id: newUser.id,
				email: newUser.email,
				fullName: newUser.fullName,
			},
		});
	} catch (error) {
		console.error('Signup API error:', error);
		return NextResponse.json(
			{
				success: false,
				error: 'Có lỗi xảy ra khi tạo tài khoản',
			},
			{ status: 500 },
		);
	}
}
