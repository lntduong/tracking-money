import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export interface Category {
	id: string;
	name: string;
	icon: string;
	color?: string;
	isDefault?: boolean;
}

interface CategorySelectProps {
	categories?: Category[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export function CategorySelect({
	categories = [],
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
					<SelectItem key={category.id} value={category.id}>
						<div className='flex items-center space-x-2'>
							<span className='text-lg'>{category.icon}</span>
							<span>{category.name}</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
