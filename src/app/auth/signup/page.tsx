'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	UserPlus,
	Loader2,
	AlertCircle,
	CheckCircle,
	Eye,
	EyeOff,
} from 'lucide-react';

interface SignupResponse {
	success: boolean;
	data?: {
		id: string;
		email: string;
		fullName: string;
	};
	error?: string;
}

export default function SignupPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// Validate passwords match
		if (formData.password !== formData.confirmPassword) {
			setError('Mật khẩu xác nhận không khớp');
			setLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					fullName: formData.fullName,
					email: formData.email,
					password: formData.password,
				}),
			});

			const data: SignupResponse = await response.json();

			if (data.success) {
				setSuccess(true);
				setTimeout(() => {
					router.push('/auth/signin?message=account-created');
				}, 2000);
			} else {
				setError(data.error || 'Có lỗi xảy ra khi tạo tài khoản');
			}
		} catch (err) {
			console.error('Signup error:', err);
			setError('Lỗi kết nối. Vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className='min-h-screen bg-muted/50 safe-area-top'>
				<div className='bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
					<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
					<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

					<div className='relative z-10'>
						<div className='flex justify-between items-center'>
							<div>
								<p className='text-white/70 text-sm font-medium'>Thành công</p>
								<h1 className='text-2xl font-bold mt-1'>
									Tài khoản đã được tạo
								</h1>
							</div>
							<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
								<CheckCircle className='w-5 h-5' />
							</div>
						</div>
					</div>
				</div>

				<div className='p-4 -mt-6'>
					<Card>
						<CardContent className='p-6'>
							<div className='text-center'>
								<CheckCircle className='w-16 h-16 text-green-600 mx-auto mb-4' />
								<h3 className='text-lg font-semibold text-green-800 mb-2'>
									Đăng ký thành công!
								</h3>
								<p className='text-gray-600 mb-4'>
									Đang chuyển đến trang đăng nhập...
								</p>
								<Loader2 className='w-6 h-6 animate-spin text-green-600 mx-auto' />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-muted/50 safe-area-top'>
			{/* Header */}
			<div className='bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				<div className='relative z-10'>
					<div className='flex justify-between items-center'>
						<div>
							<p className='text-white/70 text-sm font-medium'>Chào mừng</p>
							<h1 className='text-2xl font-bold mt-1'>Đăng ký tài khoản</h1>
						</div>
						<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
							<UserPlus className='w-5 h-5' />
						</div>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='p-4 -mt-6'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<UserPlus className='w-5 h-5 text-blue-600' />
							Tạo tài khoản mới
						</CardTitle>
					</CardHeader>
					<CardContent>
						{error && (
							<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
								<div className='flex items-center gap-2 text-red-800'>
									<AlertCircle className='w-4 h-4' />
									<span className='text-sm font-medium'>{error}</span>
								</div>
							</div>
						)}

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='fullName' className='text-base font-medium'>
									Họ và tên
								</Label>
								<Input
									id='fullName'
									type='text'
									placeholder='Nhập họ và tên của bạn'
									value={formData.fullName}
									onChange={(e) =>
										setFormData({ ...formData, fullName: e.target.value })
									}
									required
									disabled={loading}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='email' className='text-base font-medium'>
									Email
								</Label>
								<Input
									id='email'
									type='email'
									placeholder='example@gmail.com'
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									required
									disabled={loading}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='password' className='text-base font-medium'>
									Mật khẩu
								</Label>
								<div className='relative'>
									<Input
										id='password'
										type={showPassword ? 'text' : 'password'}
										placeholder='Nhập mật khẩu (ít nhất 6 ký tự)'
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										required
										disabled={loading}
										className='pr-10'
									/>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
										onClick={() => setShowPassword(!showPassword)}
										disabled={loading}
									>
										{showPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</Button>
								</div>
							</div>

							<div className='space-y-2'>
								<Label
									htmlFor='confirmPassword'
									className='text-base font-medium'
								>
									Xác nhận mật khẩu
								</Label>
								<div className='relative'>
									<Input
										id='confirmPassword'
										type={showConfirmPassword ? 'text' : 'password'}
										placeholder='Nhập lại mật khẩu'
										value={formData.confirmPassword}
										onChange={(e) =>
											setFormData({
												...formData,
												confirmPassword: e.target.value,
											})
										}
										required
										disabled={loading}
										className='pr-10'
									/>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										disabled={loading}
									>
										{showConfirmPassword ? (
											<EyeOff className='h-4 w-4' />
										) : (
											<Eye className='h-4 w-4' />
										)}
									</Button>
								</div>
							</div>

							<Button
								type='submit'
								className='w-full bg-blue-600 hover:bg-blue-700 mt-6'
								disabled={
									loading ||
									!formData.fullName ||
									!formData.email ||
									!formData.password ||
									!formData.confirmPassword
								}
							>
								{loading ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin mr-2' />
										Đang tạo tài khoản...
									</>
								) : (
									'Đăng ký'
								)}
							</Button>
						</form>

						<div className='mt-6 text-center'>
							<p className='text-sm text-gray-600'>
								Đã có tài khoản?{' '}
								<Link
									href='/auth/signin'
									className='text-blue-600 hover:text-blue-800 font-medium'
								>
									Đăng nhập ngay
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
