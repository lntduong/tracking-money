import 'next-auth';

declare module 'next-auth' {
	interface User {
		id: string;
		email: string;
		name?: string;
		image?: string;
		isPremium?: boolean;
	}

	interface Session {
		user: {
			id: string;
			email: string;
			name?: string;
			image?: string;
			isPremium?: boolean;
		};
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		isPremium?: boolean;
	}
}
