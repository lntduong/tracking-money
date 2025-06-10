import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface Category {
	value: string;
	label: string;
	icon: string;
}

const categories: Category[] = [
	{ value: 'food', label: 'Ăn uống', icon: '🍔' },
	{ value: 'transport', label: 'Đi lại', icon: '🚗' },
	{ value: 'shopping', label: 'Mua sắm', icon: '🛍️' },
	{ value: 'entertainment', label: 'Giải trí', icon: '🎮' },
	{ value: 'health', label: 'Y tế', icon: '🏥' },
	{ value: 'utilities', label: 'Tiện ích', icon: '⚡' },
	{ value: 'education', label: 'Giáo dục', icon: '📚' },
	{ value: 'travel', label: 'Du lịch', icon: '✈️' },
	{ value: 'savings', label: 'Tiết kiệm', icon: '💰' },
	{ value: 'other', label: 'Khác', icon: '📦' },
];

interface CategorySelectProps {
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export function CategorySelect({
	value,
	onValueChange,
	placeholder = 'Chọn danh mục',
	className,
}: CategorySelectProps) {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className={className}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{categories.map((category) => (
					<SelectItem key={category.value} value={category.value}>
						<div className='flex items-center space-x-2'>
							<span className='text-lg'>{category.icon}</span>
							<span>{category.label}</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
