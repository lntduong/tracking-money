'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CategorySelect } from '@/components/CategorySelect';
import { TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { useState } from 'react';

type TransactionType = 'expense' | 'income';

export default function AddPage() {
	const [transactionType, setTransactionType] =
		useState<TransactionType>('expense');

	return (
		<div className='min-h-screen bg-muted/50 safe-area-top'>
			{/* Header */}
			<div className='bg-gradient-to-br from-rose-600 via-pink-600 to-orange-600 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				{/* Background decoration */}
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				{/* Header content */}
				<div className='relative z-10'>
					<div className='flex justify-between items-center mb-6'>
						<div>
							<p className='text-white/70 text-sm font-medium'>
								Quản lý chi tiêu
							</p>
							<h1 className='text-2xl font-bold mt-1'>
								{transactionType === 'expense'
									? 'Thêm chi tiêu'
									: 'Thêm thu nhập'}
							</h1>
						</div>
						<div className='flex items-center gap-3'>
							<Button
								variant='ghost'
								size='icon'
								className='text-white hover:bg-white/20 h-10 w-10'
							>
								<Eye className='w-5 h-5' />
							</Button>
							<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
								{transactionType === 'expense' ? (
									<TrendingDown className='w-5 h-5' />
								) : (
									<TrendingUp className='w-5 h-5' />
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Transaction Type Selection */}
			<div className='p-4 -mt-6'>
				<Card>
					<CardContent className='p-4'>
						<div className='flex gap-3'>
							<Button
								onClick={() => setTransactionType('expense')}
								variant={
									transactionType === 'expense' ? 'destructive' : 'outline'
								}
								className={`flex-1 py-3 h-auto flex items-center gap-2 transition-all duration-200 ${
									transactionType === 'expense'
										? 'bg-rose-600 hover:bg-rose-700 text-white'
										: 'border-2 hover:bg-rose-50 hover:border-rose-200 text-rose-600'
								}`}
							>
								<TrendingDown className='w-5 h-5' />
								<span className='font-semibold'>Chi tiêu</span>
							</Button>
							<Button
								onClick={() => setTransactionType('income')}
								variant={transactionType === 'income' ? 'default' : 'outline'}
								className={`flex-1 py-3 h-auto flex items-center gap-2 transition-all duration-200 ${
									transactionType === 'income'
										? 'bg-emerald-600 hover:bg-emerald-700 text-white'
										: 'border-2 hover:bg-emerald-50 hover:border-emerald-200 text-emerald-600'
								}`}
							>
								<TrendingUp className='w-5 h-5' />
								<span className='font-semibold'>Thu nhập</span>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Form */}
			<div className='p-4 space-y-4'>
				<Card className='bg-gradient-to-br from-white to-slate-50/50'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2 text-slate-800'>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center ${
									transactionType === 'expense'
										? 'bg-gradient-to-br from-rose-500 to-rose-600'
										: 'bg-gradient-to-br from-emerald-500 to-emerald-600'
								}`}
							>
								{transactionType === 'expense' ? (
									<TrendingDown className='w-4 h-4 text-white' />
								) : (
									<TrendingUp className='w-4 h-4 text-white' />
								)}
							</div>
							Thông tin{' '}
							{transactionType === 'expense' ? 'chi tiêu' : 'thu nhập'}
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='space-y-2'>
							<Label
								htmlFor='amount'
								className='text-base font-medium text-slate-700'
							>
								Số tiền
							</Label>
							<Input
								id='amount'
								type='text'
								inputMode='numeric'
								placeholder='0'
								className={`text-2xl text-center border-2 bg-white ${
									transactionType === 'expense'
										? 'focus:border-rose-500'
										: 'focus:border-emerald-500'
								}`}
							/>
							<p className='text-sm text-muted-foreground'>
								Nhập số tiền{' '}
								{transactionType === 'expense' ? 'chi tiêu' : 'thu nhập'}
							</p>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='category'
								className='text-base font-medium text-slate-700'
							>
								Danh mục
							</Label>
							<CategorySelect
								className={`h-12 w-full border-2 ${
									transactionType === 'expense'
										? 'focus:border-rose-500'
										: 'focus:border-emerald-500'
								}`}
								placeholder={
									transactionType === 'expense'
										? 'Chọn danh mục chi tiêu'
										: 'Chọn danh mục thu nhập'
								}
							/>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='note'
								className='text-base font-medium text-slate-700'
							>
								Ghi chú (tùy chọn)
							</Label>
							<Textarea
								id='note'
								placeholder={`Mô tả chi tiết về ${
									transactionType === 'expense'
										? 'khoản chi tiêu'
										: 'khoản thu nhập'
								} này...`}
								className={`min-h-[80px] resize-none border-2 bg-white ${
									transactionType === 'expense'
										? 'focus:border-rose-500'
										: 'focus:border-emerald-500'
								}`}
								rows={3}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Action Button */}
				<Button
					size='lg'
					className={`w-full h-14 text-lg font-semibold shadow-lg transition-all duration-200 ${
						transactionType === 'expense'
							? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
							: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
					}`}
				>
					{transactionType === 'expense' ? (
						<TrendingDown className='w-6 h-6 mr-2' />
					) : (
						<TrendingUp className='w-6 h-6 mr-2' />
					)}
					Lưu {transactionType === 'expense' ? 'chi tiêu' : 'thu nhập'}
				</Button>
			</div>
		</div>
	);
}
