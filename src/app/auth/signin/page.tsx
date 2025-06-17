'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	LogIn,
	Loader2,
	AlertCircle,
	CheckCircle,
	Eye,
	EyeOff,
} from 'lucide-react';

export default function SigninPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		// Check for success messages from URL params
		const message = searchParams.get('message');
		if (message === 'account-created') {
			setSuccessMessage(
				'Tài khoản đã được tạo thành công! Vui lòng đăng nhập.',
			);
		}

		// Check if user is already logged in
		getSession().then((session) => {
			if (session) {
				router.push('/');
			}
		});
	}, [searchParams, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const result = await signIn('credentials', {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			if (result?.error) {
				setError('Email hoặc mật khẩu không đúng');
			} else if (result?.ok) {
				// Success - redirect to home
				router.push('/');
				router.refresh();
			}
		} catch (err) {
			console.error('Signin error:', err);
			setError('Lỗi kết nối. Vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-muted/50 safe-area-top'>
			{/* Header */}
			<div className='bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				<div className='relative z-10'>
					<div className='flex justify-between items-center'>
						<div>
							<p className='text-white/70 text-sm font-medium'>
								Chào mừng trở lại
							</p>
							<h1 className='text-2xl font-bold mt-1'>Đăng nhập</h1>
						</div>
						<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
							<LogIn className='w-5 h-5' />
						</div>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='p-4 -mt-6'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<LogIn className='w-5 h-5 text-indigo-600' />
							Đăng nhập tài khoản
						</CardTitle>
					</CardHeader>
					<CardContent>
						{successMessage && (
							<div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
								<div className='flex items-center gap-2 text-green-800'>
									<CheckCircle className='w-4 h-4' />
									<span className='text-sm font-medium'>{successMessage}</span>
								</div>
							</div>
						)}

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
									autoComplete='email'
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
										placeholder='Nhập mật khẩu của bạn'
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										required
										disabled={loading}
										className='pr-10'
										autoComplete='current-password'
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

							<Button
								type='submit'
								className='w-full bg-indigo-600 hover:bg-indigo-700 mt-6'
								disabled={loading || !formData.email || !formData.password}
							>
								{loading ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin mr-2' />
										Đang đăng nhập...
									</>
								) : (
									'Đăng nhập'
								)}
							</Button>
						</form>

						<div className='mt-6 text-center'>
							<p className='text-sm text-gray-600'>
								Chưa có tài khoản?{' '}
								<Link
									href='/auth/signup'
									className='text-indigo-600 hover:text-indigo-800 font-medium'
								>
									Đăng ký ngay
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
