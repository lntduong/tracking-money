'use client';

import { TransferForm } from '@/components/TransferForm';
import { useRouter } from 'next/navigation';

interface TransferData {
	fromWallet: string;
	toWallet: string;
	amount: string;
	note: string;
}

export default function TransferPage() {
	const router = useRouter();

	const handleSubmit = (data: TransferData) => {
		// TODO: Thực hiện chuyển khoản trong database/localStorage/context
		console.log('Chuyển khoản:', data);

		// Hiển thị thông báo thành công
		alert(`Chuyển khoản ${data.amount} VNĐ thành công!`);

		// Chuyển về trang wallet hoặc homepage
		router.push('/wallet');
	};

	const handleClose = () => {
		router.back();
	};

	return <TransferForm onSubmit={handleSubmit} onClose={handleClose} />;
}
