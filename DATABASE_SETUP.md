# 🗄️ Database Setup Guide - Money Tracking App

## 📋 Overview

Hướng dẫn setup hoàn chỉnh database PostgreSQL với Prisma cho Money Tracking App.

---

## 🛠️ Prerequisites

### 1. Install PostgreSQL
```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### 2. Create Database
```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE money_tracking_app;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE money_tracking_app TO your_username;
\q
```

---

## ⚙️ Prisma Setup

### 1. Install Prisma
```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Environment Variables
Tạo file `.env` trong thư mục root:

```env
# Database
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/money_tracking_app"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: For production
NODE_ENV="development"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Database Migration
```bash
npx prisma db push
```

### 5. Seed Database
```bash
npx prisma db seed
```

---

## 📦 Package.json Scripts

Thêm vào `package.json`:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma db push --force-reset && npm run db:seed",
    "db:migrate": "prisma migrate dev",
    "db:deploy": "prisma migrate deploy"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "devDependencies": {
    "tsx": "^4.7.0"
  }
}
```

---

## 🚀 Quick Start Commands

### Complete Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env với database credentials

# 3. Generate Prisma client
npm run db:generate

# 4. Push schema to database
npm run db:push

# 5. Seed với default data
npm run db:seed

# 6. Start development server
npm run dev
```

### Development Workflow
```bash
# Start Prisma Studio (database GUI)
npm run db:studio

# Reset database (nếu cần)
npm run db:reset

# View database
npm run db:studio
```

---

## 📊 Database Schema Overview

### Core Tables:
- **users**: User accounts và authentication
- **user_settings**: User preferences và settings
- **wallet_types**: Reference data cho wallet types
- **wallets**: User wallets với balances
- **categories**: Transaction categories (default + custom)
- **transactions**: Income/expense transactions
- **transfers**: Wallet-to-wallet transfers

### Key Features:
- ✅ UUID primary keys
- ✅ Soft deletes với CASCADE
- ✅ Auto-generated timestamps
- ✅ Proper foreign key relationships
- ✅ Type safety với Prisma

---

## 🔌 API Integration Examples

### 1. Initialize Prisma Client
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### 2. Get User Wallets
```typescript
// API: /api/wallets
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const userId = "user-uuid-here"; // từ session

  const wallets = await prisma.wallet.findMany({
    where: {
      userId: userId,
      isActive: true
    },
    include: {
      type: true,
      _count: {
        select: { transactions: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  return Response.json(wallets);
}
```

### 3. Create Transaction
```typescript
// API: /api/transactions
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { walletId, categoryId, type, amount, description } = await request.json();
  const userId = "user-uuid-here"; // từ session

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      walletId,
      categoryId,
      type, // 'income' or 'expense'
      amount: parseFloat(amount),
      description
    },
    include: {
      category: true,
      wallet: true
    }
  });

  // Auto-update wallet balance
  await prisma.wallet.update({
    where: { id: walletId },
    data: {
      currentBalance: {
        [type === 'income' ? 'increment' : 'decrement']: parseFloat(amount)
      }
    }
  });

  return Response.json(transaction);
}
```

### 4. Monthly Reports
```typescript
// API: /api/reports/monthly
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const userId = "user-uuid-here";
  const currentMonth = new Date();
  currentMonth.setDate(1);

  const summary = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      userId,
      transactionDate: {
        gte: currentMonth
      }
    },
    _sum: {
      amount: true
    },
    _count: true
  });

  const categoryBreakdown = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId,
      type: 'expense',
      transactionDate: {
        gte: currentMonth
      }
    },
    _sum: {
      amount: true
    },
    include: {
      category: {
        select: {
          name: true,
          icon: true,
          color: true
        }
      }
    }
  });

  return Response.json({ summary, categoryBreakdown });
}
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
```env
# Development
DATABASE_URL="postgresql://user:pass@localhost:5432/money_tracking_dev"

# Production (ví dụ với Supabase)
DATABASE_URL="postgresql://user:pass@db.supabase.co:5432/postgres"
```

### 2. User Data Isolation
```typescript
// Luôn filter theo userId
const userWallets = await prisma.wallet.findMany({
  where: {
    userId: session.user.id, // từ NextAuth session
    isActive: true
  }
});
```

### 3. Input Validation
```typescript
import { z } from 'zod';

const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  walletId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  description: z.string().optional()
});

// Validate input
const validatedData = transactionSchema.parse(requestData);
```

---

## 🌐 Production Deployment

### Supabase (Recommended)
```bash
# 1. Create Supabase project
# 2. Get connection string
# 3. Update DATABASE_URL
# 4. Deploy migration
npm run db:deploy
```

### Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login và create project
railway login
railway init

# 3. Add PostgreSQL
railway add postgresql

# 4. Deploy
railway up
```

### Vercel + PlanetScale
```bash
# 1. Create PlanetScale database
# 2. Get connection string
# 3. Update DATABASE_URL
# 4. Deploy to Vercel
vercel deploy
```

---

## 🧪 Testing

### Database Testing
```typescript
// __tests__/database.test.ts
import { prisma } from '@/lib/prisma';

describe('Database Operations', () => {
  test('Should create user with settings', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        fullName: 'Test User',
        settings: {
          create: {
            currency: 'VND',
            language: 'vi'
          }
        }
      },
      include: { settings: true }
    });

    expect(user.settings).toBeDefined();
    expect(user.settings?.currency).toBe('VND');
  });
});
```

---

## 🐛 Troubleshooting

### Common Issues:

**1. Connection Error**
```bash
Error: P1001: Can't reach database server
```
**Solution:** Check DATABASE_URL và PostgreSQL service

**2. Migration Error**
```bash
Error: P3009: migrate found failed migration
```
**Solution:**
```bash
npx prisma migrate reset
npm run db:seed
```

**3. Prisma Client Error**
```bash
Error: PrismaClient is unable to be run in the browser
```
**Solution:** Chỉ sử dụng Prisma trong server-side code (API routes)

---

## 📈 Monitoring & Optimization

### Performance
```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=10"
    }
  }
});
```

### Backup Strategy
```bash
# Daily backup
pg_dump money_tracking_app > backup_$(date +%Y%m%d).sql

# Restore
psql money_tracking_app < backup_20241220.sql
```

Database setup này sẽ cung cấp foundation mạnh mẽ cho Money Tracking App! 🚀