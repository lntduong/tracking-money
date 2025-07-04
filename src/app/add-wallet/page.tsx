'use client';

import { AddWalletForm } from '@/components/AddWalletForm';
import { useRouter } from 'next/navigation';
import type { WalletData } from '@/components/AddWalletForm';

export default function AddWalletPage() {
	const router = useRouter();

	const handleSubmit = (data: WalletData) => {
		// TODO: Lưu ví mới vào database/localStorage/context
		console.log('Ví mới:', data);

		// Hiển thị thông báo thành công
		alert('Tạo ví thành công!');

		// Chuyển về trang wallet
		router.push('/wallet');
	};

	const handleClose = () => {
		router.back();
	};

	return <AddWalletForm onSubmit={handleSubmit} onClose={handleClose} />;
}
