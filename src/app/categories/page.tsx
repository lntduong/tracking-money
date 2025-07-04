'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
	Tag,
	Plus,
	Trash2,
	Edit,
	Eye,
	Search,
	Filter,
	Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface Category {
	id: string;
	name: string;
	icon: string;
	color: string;
	isDefault: boolean;
	transactionCount?: number;
}

export default function CategoriesPage() {
	const router = useRouter();
	const { status } = useSession();
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [newCategoryIcon, setNewCategoryIcon] = useState('🏷️');
	const [searchTerm, setSearchTerm] = useState('');
	const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
		null,
	);
	const [editName, setEditName] = useState('');
	const [editIcon, setEditIcon] = useState('');
	const [editLoading, setEditLoading] = useState(false);
	const [showNewIconPicker, setShowNewIconPicker] = useState(false);
	const [showEditIconPicker, setShowEditIconPicker] = useState(false);

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/auth/signin');
			return;
		}

		if (status === 'authenticated') {
			fetchCategories();
		}
	}, [status, router]);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch('/api/categories');
			const result = await response.json();

			if (result.success) {
				setCategories(result.data);
			} else {
				setError(result.error || 'Failed to fetch categories');
			}
		} catch (err) {
			console.error('Error fetching categories:', err);
			setError('Failed to fetch categories');
		} finally {
			setLoading(false);
		}
	};

	const addCategory = async () => {
		if (!newCategoryName.trim()) return;

		try {
			setLoading(true);
			setError(null);

			const response = await fetch('/api/categories', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: newCategoryName.trim(),
					icon: newCategoryIcon,
					color: 'cyan',
				}),
			});

			const result = await response.json();

			if (result.success) {
				setCategories([...categories, result.data]);
				setNewCategoryName('');
				setNewCategoryIcon('🏷️');
			} else {
				setError(result.error || 'Failed to create category');
			}
		} catch (err) {
			console.error('Error creating category:', err);
			setError('Failed to create category');
		} finally {
			setLoading(false);
		}
	};

	const deleteCategory = async (id: string) => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/categories/${id}`, {
				method: 'DELETE',
			});

			const result = await response.json();

			if (result.success) {
				setCategories(categories.filter((cat) => cat.id !== id));
			} else {
				setError(result.error || 'Failed to delete category');
			}
		} catch (err) {
			console.error('Error deleting category:', err);
			setError('Failed to delete category');
		} finally {
			setLoading(false);
		}
	};

	const startEditCategory = (cat: Category) => {
		setEditingCategoryId(cat.id);
		setEditName(cat.name);
		setEditIcon(cat.icon);
	};

	const cancelEditCategory = () => {
		setEditingCategoryId(null);
		setEditName('');
		setEditIcon('');
	};

	const saveEditCategory = async (cat: Category) => {
		if (!editName.trim()) return;
		try {
			setEditLoading(true);
			setError(null);
			const response = await fetch(`/api/categories/${cat.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: editName.trim(),
					icon: editIcon,
					color: cat.color,
				}),
			});
			const result = await response.json();
			if (result.success) {
				setCategories(
					categories.map((c) => (c.id === cat.id ? result.data : c)),
				);
				cancelEditCategory();
			} else {
				setError(result.error || 'Failed to update category');
			}
		} catch (err) {
			console.error('Error updating category:', err);
			setError('Failed to update category');
		} finally {
			setEditLoading(false);
		}
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

	if (status === 'loading' || loading) {
		return (
			<div className='min-h-screen bg-muted/50 safe-area-top flex items-center justify-center'>
				<div className='text-center'>
					<div className='w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
					<p className='text-gray-600'>Đang tải danh mục...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-muted/50 safe-area-top flex items-center justify-center'>
				<div className='text-center'>
					<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Loader2 className='w-8 h-8 text-red-600' />
					</div>
					<p className='text-gray-900 font-medium mb-2'>Có lỗi xảy ra</p>
					<p className='text-gray-600 mb-4'>{error}</p>
					<Button
						onClick={fetchCategories}
						className='bg-cyan-600 hover:bg-cyan-700'
					>
						Thử lại
					</Button>
				</div>
			</div>
		);
	}

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
									disabled={loading}
								/>
							</div>
							<div className='space-y-2 relative'>
								<Label htmlFor='categoryIcon'>Icon</Label>
								<Input
									id='categoryIcon'
									value={newCategoryIcon}
									onFocus={() => setShowNewIconPicker(true)}
									onBlur={() =>
										setTimeout(() => setShowNewIconPicker(false), 200)
									}
									readOnly
									className='border-2 focus:border-cyan-500 text-center text-lg cursor-pointer bg-white'
									maxLength={2}
									disabled={loading}
									style={{ caretColor: 'transparent' }}
								/>
								{showNewIconPicker && (
									<div className='absolute z-50 top-12 right-0 min-w-[320px] max-w-xs shadow-lg rounded-xl border bg-white'>
										<Picker
											data={data}
											onEmojiSelect={(emoji: { native: string }) => {
												setNewCategoryIcon(emoji.native);
												setShowNewIconPicker(false);
											}}
											theme='light'
										/>
									</div>
								)}
							</div>
						</div>
						<Button
							onClick={addCategory}
							className='w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700'
							disabled={!newCategoryName.trim() || loading}
						>
							{loading ? (
								<Loader2 className='w-4 h-4 mr-2 animate-spin' />
							) : (
								<Plus className='w-4 h-4 mr-2' />
							)}
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
									disabled={loading}
								/>
							</div>
							<Button
								variant='outline'
								size='icon'
								className='border-2 hover:bg-cyan-50'
								disabled={loading}
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
												{editingCategoryId === category.id ? (
													<div className='flex flex-row items-center gap-1'>
														<Input
															value={editName}
															onChange={(e) => setEditName(e.target.value)}
															className='w-24 h-8 text-base px-2'
															disabled={editLoading}
															style={{ minWidth: 0 }}
														/>
														<div className='relative'>
															<Input
																value={editIcon}
																onFocus={() => setShowEditIconPicker(true)}
																onBlur={() =>
																	setTimeout(
																		() => setShowEditIconPicker(false),
																		200,
																	)
																}
																readOnly
																className='w-10 h-8 text-lg text-center px-1 cursor-pointer bg-white'
																maxLength={2}
																disabled={editLoading}
																style={{
																	minWidth: 0,
																	caretColor: 'transparent',
																}}
															/>
															{showEditIconPicker && (
																<div className='absolute z-50 bottom-12 left-0 min-w-[320px] max-w-xs shadow-lg rounded-xl border bg-white'>
																	<Picker
																		data={data}
																		onEmojiSelect={(emoji: {
																			native: string;
																		}) => {
																			setEditIcon(emoji.native);
																			setShowEditIconPicker(false);
																		}}
																		theme='light'
																	/>
																</div>
															)}
														</div>
														<Button
															onClick={() => saveEditCategory(category)}
															disabled={editLoading || !editName.trim()}
															className='px-2 h-8 bg-cyan-600 hover:bg-cyan-700 text-white text-sm min-w-0'
															style={{ minWidth: 0 }}
														>
															{editLoading ? (
																<Loader2 className='w-4 h-4 animate-spin' />
															) : (
																'Lưu'
															)}
														</Button>
														<Button
															variant='outline'
															onClick={cancelEditCategory}
															disabled={editLoading}
															className='px-2 h-8 text-sm min-w-0'
															style={{ minWidth: 0 }}
														>
															Huỷ
														</Button>
													</div>
												) : (
													<>
														<h3 className='font-semibold text-lg'>
															{category.name}
														</h3>
														<p className='text-sm opacity-75'>
															{category.transactionCount || 0} giao dịch
														</p>
													</>
												)}
											</div>
										</div>
										<div className='flex items-center space-x-2'>
											{!category.isDefault &&
												editingCategoryId !== category.id && (
													<>
														<Button
															variant='ghost'
															size='icon'
															className='hover:bg-white/50'
															onClick={() => startEditCategory(category)}
															disabled={loading || editLoading}
														>
															<Edit className='w-4 h-4' />
														</Button>
														<Button
															variant='ghost'
															size='icon'
															className='hover:bg-white/50 text-red-600'
															onClick={() => deleteCategory(category.id)}
															disabled={loading || editLoading}
														>
															<Trash2 className='w-4 h-4' />
														</Button>
													</>
												)}
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
