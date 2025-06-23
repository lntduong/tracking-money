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
import { ArrowLeftRight, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface Wallet {
	id: string;
	name: string;
	balance: number;
	type: { icon: string; name: string };
}

interface TransferFormProps {
	onClose?: () => void;
	onSubmit?: (data: TransferData) => void;
	wallets: Wallet[];
}

interface TransferData {
	fromWallet: string;
	toWallet: string;
	amount: string;
	note: string;
}

export function TransferForm({
	onClose,
	onSubmit,
	wallets,
}: TransferFormProps) {
	const [formData, setFormData] = useState<TransferData>({
		fromWallet: '',
		toWallet: '',
		amount: '',
		note: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (formData.fromWallet === formData.toWallet) {
			alert('Ví nguồn và ví đích không thể giống nhau!');
			return;
		}
		onSubmit?.(formData);
		setFormData({ fromWallet: '', toWallet: '', amount: '', note: '' });
	};

	const handleSwapWallets = () => {
		setFormData({
			...formData,
			fromWallet: formData.toWallet,
			toWallet: formData.fromWallet,
		});
	};

	const getWalletInfo = (walletId: string) =>
		wallets.find((w) => w.id === walletId);

	return (
		<div className='min-h-screen bg-muted/50 safe-area-top'>
			{/* Header */}
			<div className='bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				<div className='relative z-10'>
					<div className='flex justify-between items-center'>
						<div>
							<p className='text-white/70 text-sm font-medium'>
								Di chuyển tiền
							</p>
							<h1 className='text-2xl font-bold mt-1'>Chuyển khoản</h1>
						</div>
						<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
							<ArrowLeftRight className='w-5 h-5' />
						</div>
					</div>
				</div>
			</div>

			{/* Form */}
			<div className='p-4 -mt-6'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<ArrowLeftRight className='w-5 h-5 text-violet-600' />
							Chi tiết chuyển khoản
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='space-y-2'>
								<Label htmlFor='fromWallet' className='text-base font-medium'>
									Từ ví
								</Label>
								<Select
									value={formData.fromWallet}
									onValueChange={(value) =>
										setFormData({ ...formData, fromWallet: value })
									}
								>
									<SelectTrigger className='h-12 w-full'>
										<SelectValue placeholder='Chọn ví nguồn' />
									</SelectTrigger>
									<SelectContent>
										{wallets.map((wallet) => (
											<SelectItem key={wallet.id} value={wallet.id}>
												<div className='flex items-center justify-between w-full'>
													<div className='flex items-center space-x-2'>
														<span className='text-lg'>{wallet.type.icon}</span>
														<span>{wallet.name}</span>
													</div>
													<span className='text-sm text-muted-foreground ml-4'>
														{wallet.balance.toLocaleString('vi-VN')} VNĐ
													</span>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{formData.fromWallet && (
									<p className='text-sm text-muted-foreground'>
										Số dư:{' '}
										{getWalletInfo(formData.fromWallet)?.balance.toLocaleString(
											'vi-VN',
										)}{' '}
										VNĐ
									</p>
								)}
							</div>

							{/* Swap Button */}
							<div className='flex justify-center'>
								<Button
									type='button'
									variant='outline'
									size='icon'
									onClick={handleSwapWallets}
									className='rounded-full h-10 w-10 border-2'
									disabled={!formData.fromWallet && !formData.toWallet}
								>
									<ArrowDown className='w-4 h-4' />
								</Button>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='toWallet' className='text-base font-medium'>
									Đến ví
								</Label>
								<Select
									value={formData.toWallet}
									onValueChange={(value) =>
										setFormData({ ...formData, toWallet: value })
									}
								>
									<SelectTrigger className='h-12 w-full'>
										<SelectValue placeholder='Chọn ví đích' />
									</SelectTrigger>
									<SelectContent>
										{wallets
											.filter((wallet) => wallet.id !== formData.fromWallet)
											.map((wallet) => (
												<SelectItem key={wallet.id} value={wallet.id}>
													<div className='flex items-center justify-between w-full'>
														<div className='flex items-center space-x-2'>
															<span className='text-lg'>
																{wallet.type.icon}
															</span>
															<span>{wallet.name}</span>
														</div>
														<span className='text-sm text-muted-foreground ml-4'>
															{wallet.balance.toLocaleString('vi-VN')} VNĐ
														</span>
													</div>
												</SelectItem>
											))}
									</SelectContent>
								</Select>
								{formData.toWallet && (
									<p className='text-sm text-muted-foreground'>
										Số dư:{' '}
										{getWalletInfo(formData.toWallet)?.balance.toLocaleString(
											'vi-VN',
										)}{' '}
										VNĐ
									</p>
								)}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='amount' className='text-base font-medium'>
									Số tiền chuyển
								</Label>
								<Input
									id='amount'
									type='text'
									inputMode='numeric'
									placeholder='0'
									value={formData.amount}
									onChange={(e) =>
										setFormData({ ...formData, amount: e.target.value })
									}
									className='text-xl text-center h-12 border-2 focus:border-violet-500'
									required
								/>
								<p className='text-sm text-muted-foreground'>
									Nhập số tiền muốn chuyển
								</p>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='note' className='text-base font-medium'>
									Ghi chú (tùy chọn)
								</Label>
								<Textarea
									id='note'
									placeholder='Mục đích chuyển khoản...'
									value={formData.note}
									onChange={(e) =>
										setFormData({ ...formData, note: e.target.value })
									}
									className='min-h-[80px] resize-none'
									rows={3}
								/>
							</div>

							{/* Transfer Summary */}
							{formData.fromWallet && formData.toWallet && formData.amount && (
								<div className='bg-muted/50 rounded-lg p-4 space-y-2'>
									<h4 className='font-semibold text-sm text-muted-foreground'>
										Xác nhận chuyển khoản:
									</h4>
									<div className='flex items-center justify-between text-sm'>
										<span>Từ: {getWalletInfo(formData.fromWallet)?.name}</span>
										<ArrowLeftRight className='w-4 h-4 text-muted-foreground' />
										<span>Đến: {getWalletInfo(formData.toWallet)?.name}</span>
									</div>
									<p className='text-center font-bold text-lg text-violet-600'>
										{formData.amount} VNĐ
									</p>
								</div>
							)}

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
									className='flex-1 bg-violet-600 hover:bg-violet-700'
									disabled={
										!formData.fromWallet ||
										!formData.toWallet ||
										!formData.amount
									}
								>
									Chuyển khoản
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
