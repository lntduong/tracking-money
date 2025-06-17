import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Extend next-auth types
declare module 'next-auth' {
	interface User {
		id: string;
		email: string;
		name: string;
		image?: string | null;
		isPremium: boolean;
	}

	interface Session {
		user: User & {
			id: string;
			isPremium: boolean;
		};
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		isPremium: boolean;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					// Find user by email
					const user = await prisma.user.findUnique({
						where: {
							email: credentials.email,
						},
					});

					if (!user) {
						return null;
					}

					// Verify password
					const isPasswordValid = await bcrypt.compare(
						credentials.password,
						user.passwordHash,
					);

					if (!isPasswordValid) {
						return null;
					}

					// Update last login
					await prisma.user.update({
						where: { id: user.id },
						data: { lastLogin: new Date() },
					});

					// Log user data for debugging
					console.log('Authorize - User from DB:', user);

					// Return user with correct ID format
					return {
						id: user.id, // This should be the UUID from database
						email: user.email,
						name: user.fullName,
						image: user.avatarUrl,
						isPremium: user.isPremium,
					};
				} catch (error) {
					console.error('Authentication error:', error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 7 * 24 * 60 * 60, // 7 days
	},
	jwt: {
		maxAge: 7 * 24 * 60 * 60, // 7 days
	},
	pages: {
		signIn: '/auth/signin',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				console.log('JWT Callback - User:', user);
				// Use the ID from the user object (which should be the UUID from database)
				token.id = user.id;
				token.isPremium = user.isPremium;
			}
			console.log('JWT Callback - Token:', token);
			return token;
		},
		async session({ session, token }) {
			if (token) {
				console.log('Session Callback - Token:', token);
				// Use the ID from the token (which should be the UUID from database)
				session.user.id = token.id;
				session.user.isPremium = token.isPremium;
			}
			console.log('Session Callback - Session:', session);
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here', // Fallback secret for development
};
