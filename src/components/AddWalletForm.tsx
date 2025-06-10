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
import { Wallet, Plus } from 'lucide-react';
import { useState } from 'react';

interface AddWalletFormProps {
	onClose?: () => void;
	onSubmit?: (data: WalletData) => void;
}

interface WalletData {
	name: string;
	type: string;
	initialBalance: string;
	description: string;
}

const walletTypes = [
	{ value: 'cash', label: 'Tiền mặt', icon: '💵' },
	{ value: 'bank', label: 'Tài khoản ngân hàng', icon: '🏦' },
	{ value: 'credit', label: 'Thẻ tín dụng', icon: '💳' },
	{ value: 'savings', label: 'Tài khoản tiết kiệm', icon: '💰' },
	{ value: 'ewallet', label: 'Ví điện tử', icon: '📱' },
	{ value: 'investment', label: 'Tài khoản đầu tư', icon: '📈' },
];

export function AddWalletForm({ onClose, onSubmit }: AddWalletFormProps) {
	const [formData, setFormData] = useState<WalletData>({
		name: '',
		type: '',
		initialBalance: '',
		description: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit?.(formData);
		// Reset form
		setFormData({
			name: '',
			type: '',
			initialBalance: '',
			description: '',
		});
	};

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
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='walletType' className='text-base font-medium'>
									Loại ví
								</Label>
								<Select
									value={formData.type}
									onValueChange={(value) =>
										setFormData({ ...formData, type: value })
									}
								>
									<SelectTrigger className='h-12 w-full'>
										<SelectValue placeholder='Chọn loại ví' />
									</SelectTrigger>
									<SelectContent>
										{walletTypes.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												<div className='flex items-center space-x-2'>
													<span className='text-lg'>{type.icon}</span>
													<span>{type.label}</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
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
									onChange={(e) =>
										setFormData({ ...formData, initialBalance: e.target.value })
									}
									className='text-xl text-center border-2 focus:border-emerald-500'
								/>
								<p className='text-sm text-muted-foreground'>
									Nhập số dư hiện tại của ví này
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
								/>
							</div>

							<div className='flex gap-3 pt-4'>
								{onClose && (
									<Button
										type='button'
										variant='outline'
										onClick={onClose}
										className='flex-1'
									>
										Hủy
									</Button>
								)}
								<Button
									type='submit'
									className='flex-1 bg-emerald-600 hover:bg-emerald-700'
								>
									Tạo ví
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
