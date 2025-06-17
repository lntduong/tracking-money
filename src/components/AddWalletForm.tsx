'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Wallet, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AddWalletFormProps {
	onClose?: () => void;
	onSubmit?: (data: WalletData) => void;
}

interface WalletData {
	name: string;
	walletType: string;
	initialBalance: string;
	description: string;
}

interface WalletType {
	id: string;
	name: string;
	icon: string;
	description: string;
}

interface WalletTypesResponse {
	success: boolean;
	data: WalletType[];
}

interface CreateWalletResponse {
	success: boolean;
	data?: {
		id: string;
		name: string;
		type: WalletType;
		balance: number;
		transactionCount: number;
		description: string | null;
		isActive: boolean;
		createdAt: string;
	};
	error?: string;
}

export function AddWalletForm({ onClose, onSubmit }: AddWalletFormProps) {
	const router = useRouter();
	const [formData, setFormData] = useState<WalletData>({
		name: '',
		walletType: '',
		initialBalance: '',
		description: '',
	});

	const [walletTypes, setWalletTypes] = useState<WalletType[]>([]);
	const [loading, setLoading] = useState(false);
	const [typesLoading, setTypesLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		fetchWalletTypes();
	}, []);

	const fetchWalletTypes = async () => {
		try {
			setTypesLoading(true);
			const response = await fetch('/api/wallet-types');
			const data: WalletTypesResponse = await response.json();

			if (data.success) {
				setWalletTypes(data.data);
			} else {
				setError('Không thể tải danh sách loại ví');
			}
		} catch (err) {
			console.error('Error fetching wallet types:', err);
			setError('Lỗi kết nối khi tải loại ví');
		} finally {
			setTypesLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/wallets', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name,
					walletType: formData.walletType,
					initialBalance: parseFloat(formData.initialBalance) || 0,
					description: formData.description || null,
				}),
			});

			const data: CreateWalletResponse = await response.json();

			if (data.success) {
				setSuccess(true);

				// Call parent onSubmit if provided
				if (onSubmit) {
					onSubmit(formData);
				}

				// Reset form
				setFormData({
					name: '',
					walletType: '',
					initialBalance: '',
					description: '',
				});

				// Redirect to wallet page after a short delay
				setTimeout(() => {
					router.push('/wallet');
				}, 1500);
			} else {
				setError(data.error || 'Không thể tạo ví');
			}
		} catch (err) {
			console.error('Error creating wallet:', err);
			setError('Lỗi kết nối khi tạo ví');
		} finally {
			setLoading(false);
		}
	};

	const getWalletTypeName = (name: string) => {
		switch (name.toLowerCase()) {
			case 'cash':
				return 'Tiền mặt';
			case 'bank_account':
				return 'Tài khoản ngân hàng';
			case 'credit_card':
				return 'Thẻ tín dụng';
			case 'savings':
				return 'Tài khoản tiết kiệm';
			case 'e_wallet':
				return 'Ví điện tử';
			case 'investment':
				return 'Tài khoản đầu tư';
			default:
				return name;
		}
	};

	if (success) {
		return (
			<div className='min-h-screen bg-muted/50 safe-area-top'>
				<div className='bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
					<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
					<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

					<div className='relative z-10'>
						<div className='flex justify-between items-center'>
							<div>
								<p className='text-white/70 text-sm font-medium'>Thành công</p>
								<h1 className='text-2xl font-bold mt-1'>Ví đã được tạo</h1>
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
								<CheckCircle className='w-16 h-16 text-emerald-600 mx-auto mb-4' />
								<h3 className='text-lg font-semibold text-emerald-800 mb-2'>
									Ví đã được tạo thành công!
								</h3>
								<p className='text-gray-600 mb-4'>
									Đang chuyển đến trang quản lý ví...
								</p>
								<Loader2 className='w-6 h-6 animate-spin text-emerald-600 mx-auto' />
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
			<div className='bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				<div className='relative z-10'>
					<div className='flex justify-between items-center'>
						<div>
							<p className='text-white/70 text-sm font-medium'>Tạo mới</p>
							<h1 className='text-2xl font-bold mt-1'>Thêm ví</h1>
						</div>
						<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
							<Plus className='w-5 h-5' />
						</div>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='p-4 -mt-6'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Wallet className='w-5 h-5 text-emerald-600' />
							Thông tin ví mới
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

						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='space-y-2'>
								<Label htmlFor='walletName' className='text-base font-medium'>
									Tên ví
								</Label>
								<Input
									id='walletName'
									type='text'
									placeholder='Ví tiền mặt, Tài khoản Vietcombank...'
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
									disabled={loading}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='walletType' className='text-base font-medium'>
									Loại ví
								</Label>
								{typesLoading ? (
									<div className='h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
										<Loader2 className='w-4 h-4 animate-spin text-gray-600' />
										<span className='ml-2 text-sm text-gray-600'>
											Đang tải...
										</span>
									</div>
								) : (
									<Select
										value={formData.walletType}
										onValueChange={(value) =>
											setFormData({ ...formData, walletType: value })
										}
										disabled={loading}
									>
										<SelectTrigger className='h-12 w-full'>
											<SelectValue placeholder='Chọn loại ví' />
										</SelectTrigger>
										<SelectContent>
											{walletTypes.map((type) => (
												<SelectItem key={type.id} value={type.id}>
													<div className='flex items-center space-x-2'>
														<span className='text-lg'>{type.icon}</span>
														<span>{getWalletTypeName(type.name)}</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</div>

							<div className='space-y-2'>
								<Label
									htmlFor='initialBalance'
									className='text-base font-medium'
								>
									Số dư ban đầu
								</Label>
								<Input
									id='initialBalance'
									type='text'
									inputMode='numeric'
									placeholder='0'
									value={formData.initialBalance}
									onChange={(e) => {
										// Only allow numbers and decimal point
										const value = e.target.value.replace(/[^0-9.]/g, '');
										setFormData({ ...formData, initialBalance: value });
									}}
									className='text-xl text-center border-2 focus:border-emerald-500'
									disabled={loading}
								/>
								<p className='text-sm text-muted-foreground'>
									Nhập số dư hiện tại của ví này (VNĐ)
								</p>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='description' className='text-base font-medium'>
									Mô tả (tùy chọn)
								</Label>
								<Textarea
									id='description'
									placeholder='Ghi chú thêm về ví này...'
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									className='min-h-[80px] resize-none'
									rows={3}
									disabled={loading}
								/>
							</div>

							<div className='flex gap-3 pt-4'>
								{onClose && (
									<Button
										type='button'
										variant='outline'
										onClick={onClose}
										className='flex-1'
										disabled={loading}
									>
										Hủy
									</Button>
								)}
								<Button
									type='submit'
									className='flex-1 bg-emerald-600 hover:bg-emerald-700'
									disabled={loading || !formData.name || !formData.walletType}
								>
									{loading ? (
										<>
											<Loader2 className='w-4 h-4 animate-spin mr-2' />
											Đang tạo...
										</>
									) : (
										'Tạo ví'
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
