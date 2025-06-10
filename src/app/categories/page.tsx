'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, Trash2, Edit, Eye, Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface Category {
	id: string;
	name: string;
	icon: string;
	color: string;
	transactionCount: number;
}

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([
		{
			id: '1',
			name: 'Ăn uống',
			icon: '🍔',
			color: 'orange',
			transactionCount: 45,
		},
		{
			id: '2',
			name: 'Đi lại',
			icon: '🚗',
			color: 'blue',
			transactionCount: 32,
		},
		{
			id: '3',
			name: 'Mua sắm',
			icon: '🛍️',
			color: 'purple',
			transactionCount: 28,
		},
		{
			id: '4',
			name: 'Giải trí',
			icon: '🎮',
			color: 'green',
			transactionCount: 15,
		},
		{ id: '5', name: 'Y tế', icon: '🏥', color: 'red', transactionCount: 8 },
		{
			id: '6',
			name: 'Tiện ích',
			icon: '⚡',
			color: 'yellow',
			transactionCount: 12,
		},
		{
			id: '7',
			name: 'Giáo dục',
			icon: '📚',
			color: 'indigo',
			transactionCount: 6,
		},
		{
			id: '8',
			name: 'Du lịch',
			icon: '✈️',
			color: 'teal',
			transactionCount: 3,
		},
	]);

	const [newCategoryName, setNewCategoryName] = useState('');
	const [newCategoryIcon, setNewCategoryIcon] = useState('🏷️');
	const [searchTerm, setSearchTerm] = useState('');

	const addCategory = () => {
		if (newCategoryName.trim()) {
			const newCategory: Category = {
				id: Date.now().toString(),
				name: newCategoryName.trim(),
				icon: newCategoryIcon,
				color: 'cyan',
				transactionCount: 0,
			};
			setCategories([...categories, newCategory]);
			setNewCategoryName('');
			setNewCategoryIcon('🏷️');
		}
	};

	const deleteCategory = (id: string) => {
		setCategories(categories.filter((cat) => cat.id !== id));
	};

	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const getColorClasses = (color: string) => {
		const colorMap = {
			orange: 'from-orange-100 to-red-100 border-orange-200 text-orange-700',
			blue: 'from-blue-100 to-cyan-100 border-blue-200 text-blue-700',
			purple: 'from-purple-100 to-pink-100 border-purple-200 text-purple-700',
			green: 'from-green-100 to-emerald-100 border-green-200 text-green-700',
			red: 'from-red-100 to-rose-100 border-red-200 text-red-700',
			yellow: 'from-yellow-100 to-amber-100 border-yellow-200 text-yellow-700',
			indigo: 'from-indigo-100 to-blue-100 border-indigo-200 text-indigo-700',
			teal: 'from-teal-100 to-cyan-100 border-teal-200 text-teal-700',
			cyan: 'from-cyan-100 to-teal-100 border-cyan-200 text-cyan-700',
		};
		return colorMap[color as keyof typeof colorMap] || colorMap.cyan;
	};

	return (
		<div className='min-h-screen bg-muted/50 safe-area-top'>
			{/* Header */}
			<div className='bg-gradient-to-br from-cyan-500 via-teal-500 to-blue-500 text-white p-6 rounded-b-3xl relative overflow-hidden'>
				{/* Background decoration */}
				<div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16'></div>
				<div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

				{/* Header content */}
				<div className='relative z-10'>
					<div className='flex justify-between items-center mb-6'>
						<div>
							<p className='text-white/70 text-sm font-medium'>
								Quản lý phân loại
							</p>
							<h1 className='text-2xl font-bold mt-1'>Danh mục</h1>
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
								<Tag className='w-5 h-5' />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='p-4 space-y-6'>
				{/* Add New Category */}
				<Card className='bg-gradient-to-br from-white to-cyan-50 border-0 shadow-lg'>
					<CardHeader className='pb-3'>
						<CardTitle className='flex items-center space-x-2'>
							<Plus className='h-5 w-5 text-cyan-600' />
							<span>Thêm danh mục mới</span>
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='categoryName'>Tên danh mục</Label>
								<Input
									id='categoryName'
									value={newCategoryName}
									onChange={(e) => setNewCategoryName(e.target.value)}
									placeholder='Nhập tên danh mục'
									className='border-2 focus:border-cyan-500'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='categoryIcon'>Icon</Label>
								<Input
									id='categoryIcon'
									value={newCategoryIcon}
									onChange={(e) => setNewCategoryIcon(e.target.value)}
									placeholder='🏷️'
									className='border-2 focus:border-cyan-500 text-center text-lg'
									maxLength={2}
								/>
							</div>
						</div>
						<Button
							onClick={addCategory}
							className='w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700'
							disabled={!newCategoryName.trim()}
						>
							<Plus className='w-4 h-4 mr-2' />
							Thêm danh mục
						</Button>
					</CardContent>
				</Card>

				{/* Search and Filter */}
				<Card className='bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg'>
					<CardContent className='p-4'>
						<div className='flex gap-3'>
							<div className='flex-1 relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
								<Input
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder='Tìm kiếm danh mục...'
									className='pl-10 border-2 focus:border-cyan-500'
								/>
							</div>
							<Button
								variant='outline'
								size='icon'
								className='border-2 hover:bg-cyan-50'
							>
								<Filter className='w-4 h-4' />
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Categories List */}
				<Card className='bg-gradient-to-br from-white to-teal-50 border-0 shadow-lg'>
					<CardHeader className='pb-3'>
						<CardTitle className='flex items-center justify-between'>
							<div className='flex items-center space-x-2'>
								<Tag className='h-5 w-5 text-teal-600' />
								<span>Danh sách danh mục</span>
							</div>
							<Badge className='bg-teal-100 text-teal-700'>
								{filteredCategories.length} danh mục
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-3'>
						{filteredCategories.length === 0 ? (
							<div className='text-center py-8'>
								<Tag className='w-12 h-12 text-gray-300 mx-auto mb-2' />
								<p className='text-gray-500'>Không tìm thấy danh mục nào</p>
							</div>
						) : (
							filteredCategories.map((category) => (
								<div
									key={category.id}
									className={`bg-gradient-to-br ${getColorClasses(
										category.color,
									)} p-4 rounded-xl border`}
								>
									<div className='flex items-center justify-between'>
										<div className='flex items-center space-x-3'>
											<div className='w-12 h-12 bg-white/50 rounded-full flex items-center justify-center border-2 border-white/30'>
												<span className='text-xl'>{category.icon}</span>
											</div>
											<div>
												<h3 className='font-semibold text-lg'>
													{category.name}
												</h3>
												<p className='text-sm opacity-75'>
													{category.transactionCount} giao dịch
												</p>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<Button
												variant='ghost'
												size='icon'
												className='h-8 w-8 hover:bg-white/30'
											>
												<Edit className='w-4 h-4' />
											</Button>
											<Button
												variant='ghost'
												size='icon'
												className='h-8 w-8 hover:bg-white/30 text-red-600'
												onClick={() => deleteCategory(category.id)}
											>
												<Trash2 className='w-4 h-4' />
											</Button>
										</div>
									</div>
								</div>
							))
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
