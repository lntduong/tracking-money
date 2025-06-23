'use client';

import { TransferForm } from '@/components/TransferForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Wallet {
	id: string;
	name: string;
	balance: number;
	type: { icon: string; name: string };
}

interface TransferData {
	fromWallet: string;
	toWallet: string;
	amount: string;
	note: string;
}

export default function TransferPage() {
	const router = useRouter();
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchWallets() {
			try {
				const res = await fetch('/api/wallets');
				const result = await res.json();
				if (result.success) {
					setWallets(result.data.wallets);
				}
			} finally {
				setLoading(false);
			}
		}
		fetchWallets();
	}, []);

	const handleSubmit = async (data: TransferData) => {
		try {
			const res = await fetch('/api/transfer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fromWalletId: data.fromWallet,
					toWalletId: data.toWallet,
					amount: data.amount,
					note: data.note,
				}),
			});
			const result = await res.json();
			if (result.success) {
				alert('Chuyển khoản thành công!');
				router.push('/wallet');
			} else {
				alert(result.error || 'Chuyển khoản thất bại');
			}
		} catch {
			alert('Có lỗi xảy ra khi chuyển khoản');
		}
	};

	const handleClose = () => {
		router.back();
	};

	if (loading) return <div className='p-8 text-center'>Đang tải ví...</div>;

	return (
		<TransferForm
			onSubmit={handleSubmit}
			onClose={handleClose}
			wallets={wallets}
		/>
	);
}
