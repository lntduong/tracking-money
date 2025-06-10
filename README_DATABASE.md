# 💰 Money Tracking App - Database Design

## 📋 Overview

Sau khi review chi tiết source code, tôi đề xuất database schema PostgreSQL hoàn chỉnh cho ứng dụng theo dõi chi tiêu với các tính năng:

✅ **Multi-user system** với authentication
✅ **Multiple wallets** (6 types: cash, bank, credit, savings, ewallet, investment)
✅ **Categorized transactions** với 10+ default categories
✅ **Wallet-to-wallet transfers** với validation
✅ **Real-time analytics** cho reports page
✅ **User preferences** và settings
✅ **Auto balance calculation** với database triggers

---

## 🏗️ Core Tables

### 1. USERS 👥
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    is_premium BOOLEAN DEFAULT FALSE,
    member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Mapping:** Account page - "Nguyễn Văn A", Premium badge, member since

### 2. CATEGORIES 🏷️
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    color VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);
```
**Mapping:** Categories page với CRUD, CategorySelect component

### 3. WALLET_TYPES 💼
```sql
CREATE TABLE wallet_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    description TEXT
);

INSERT INTO wallet_types VALUES
('cash', 'Tiền mặt', '💵', 'Tiền mặt cầm tay'),
('bank', 'Tài khoản ngân hàng', '🏦', 'Tài khoản ngân hàng thông thường'),
('credit', 'Thẻ tín dụng', '💳', 'Thẻ tín dụng và thẻ ghi nợ'),
('savings', 'Tài khoản tiết kiệm', '💰', 'Tài khoản tiết kiệm có lãi suất'),
('ewallet', 'Ví điện tử', '📱', 'Ví điện tử (MoMo, ZaloPay)'),
('investment', 'Tài khoản đầu tư', '📈', 'Tài khoản đầu tư chứng khoán');
```
**Mapping:** AddWalletForm component với 6 wallet types

### 4. WALLETS 👛
```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    wallet_type VARCHAR(20) REFERENCES wallet_types(id),
    initial_balance DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Mapping:** Wallet page (Ví chính: 1,250,000), Homepage ATM card (6,250,000)

### 5. TRANSACTIONS 💸
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Mapping:** Add page (expense/income), Recent transactions ("Ăn trưa": -85,000)

### 6. TRANSFERS 🔄
```sql
CREATE TABLE transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    from_wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    to_wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    note TEXT,
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (from_wallet_id != to_wallet_id)
);
```
**Mapping:** TransferForm với from/to wallet selection, swap functionality

### 7. USER_SETTINGS ⚙️
```sql
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(10) DEFAULT 'VND',
    language VARCHAR(10) DEFAULT 'vi',
    timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
    notification_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚡ Database Triggers

### Auto Balance Update
```sql
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'income' THEN
            UPDATE wallets SET current_balance = current_balance + NEW.amount
            WHERE id = NEW.wallet_id;
        ELSIF NEW.type = 'expense' THEN
            UPDATE wallets SET current_balance = current_balance - NEW.amount
            WHERE id = NEW.wallet_id;
        END IF;
        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        IF OLD.type = 'income' THEN
            UPDATE wallets SET current_balance = current_balance - OLD.amount
            WHERE id = OLD.wallet_id;
        ELSIF OLD.type = 'expense' THEN
            UPDATE wallets SET current_balance = current_balance + OLD.amount
            WHERE id = OLD.wallet_id;
        END IF;
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_balance_trigger
    AFTER INSERT OR DELETE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_balance();
```

---

## 📊 Analytics Views

### Monthly Summary (Reports Page)
```sql
CREATE VIEW monthly_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', transaction_date) as month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_savings
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', transaction_date);
```

### Category Spending với Progress Bars
```sql
CREATE VIEW category_spending AS
SELECT
    t.user_id,
    c.name as category_name,
    c.icon,
    c.color,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    ROUND(SUM(t.amount) * 100.0 / NULLIF(SUM(SUM(t.amount)) OVER
        (PARTITION BY t.user_id, DATE_TRUNC('month', t.transaction_date)), 0), 1) as percentage
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, c.id, c.name, c.icon, c.color, DATE_TRUNC('month', t.transaction_date);
```

**Output:** 🍔 Ăn uống (36.6%), 🛍️ Mua sắm (32.0%), 🚗 Đi lại (17.1%), 🎮 Giải trí (14.3%)

---

## 🚀 Performance Indexes

```sql
-- Core user queries
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);

-- Reports & analytics
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- Composite indexes
CREATE INDEX idx_transactions_user_type_date ON transactions(user_id, type, transaction_date);
CREATE INDEX idx_transactions_user_category_date ON transactions(user_id, category_id, transaction_date);
```

---

## 📋 API Query Examples

### Homepage Data
```sql
-- Total balance
SELECT SUM(current_balance) FROM wallets
WHERE user_id = $1 AND is_active = TRUE;

-- Recent transactions
SELECT t.*, c.name as category_name, c.icon
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1
ORDER BY t.transaction_date DESC LIMIT 5;

-- Monthly summary for card
SELECT
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
FROM transactions
WHERE user_id = $1
AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE);
```

### Reports Page Data
```sql
-- Monthly overview
SELECT * FROM monthly_summary
WHERE user_id = $1 AND month = DATE_TRUNC('month', CURRENT_DATE);

-- Category breakdown
SELECT * FROM category_spending
WHERE user_id = $1
ORDER BY total_amount DESC;
```

---

## 🔗 Relationships Diagram

```
users (1) -----> (*) wallets
users (1) -----> (*) transactions
users (1) -----> (*) transfers
users (1) -----> (*) categories
users (1) -----> (1) user_settings

wallets (1) -----> (*) transactions
wallets (1) -----> (*) transfers (from)
wallets (1) -----> (*) transfers (to)

wallet_types (1) -----> (*) wallets
categories (1) -----> (*) transactions
```

---

## 🎯 Implementation Steps

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb money_tracking_app
psql money_tracking_app -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

### 2. ORM Choice
**Prisma (Recommended):**
```bash
npm install prisma @prisma/client
npx prisma init
```

**Sample prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid()) @db.Uuid
  email        String   @unique
  passwordHash String   @map("password_hash")
  fullName     String   @map("full_name")
  isPremium    Boolean  @default(false) @map("is_premium")

  wallets      Wallet[]
  transactions Transaction[]
  transfers    Transfer[]
  categories   Category[]

  @@map("users")
}

model Category {
  id        String  @id @default(uuid()) @db.Uuid
  userId    String? @map("user_id") @db.Uuid
  name      String
  icon      String
  color     String
  isDefault Boolean @default(false) @map("is_default")

  user         User?         @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  @@unique([userId, name])
  @@map("categories")
}
```

### 3. Environment Setup
```env
DATABASE_URL="postgresql://username:password@localhost:5432/money_tracking_app"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. API Routes Structure
```
/api/
├── auth/           # NextAuth.js authentication
├── users/          # User profile management
├── wallets/        # Wallet CRUD operations
├── transactions/   # Transaction management
├── transfers/      # Wallet transfers
├── categories/     # Category management
└── reports/        # Analytics & reports
```

---

## 🔒 Security Features

### Row Level Security
```sql
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_wallets ON wallets FOR ALL TO authenticated
USING (user_id = auth.uid());
```

### Data Validation
- Positive amounts only
- Valid wallet types
- Prevent self-transfers
- Unique email addresses
- Category name uniqueness per user

---

## 📈 Future Enhancements

### Budget Planning Table
```sql
CREATE TABLE budget_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    budget_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    period_type VARCHAR(20) CHECK (period_type IN ('monthly', 'weekly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Recurring Transactions
```sql
CREATE TABLE recurring_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')),
    frequency VARCHAR(20) CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    next_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

---

Schema này được thiết kế dựa trên phân tích chi tiết UI hiện có và có thể implement ngay lập tức với đầy đủ tính năng! 🚀