# 🗄️ PostgreSQL Database Schema - Money Tracking App

## 📋 Executive Summary

Sau khi review chi tiết toàn bộ source code của ứng dụng Money Tracking, tôi đề xuất database schema PostgreSQL hoàn chỉnh và tối ưu với các đặc điểm:

**🎯 Phân tích từ Source Code:**
- ✅ Hỗ trợ multi-user với authentication
- ✅ Quản lý nhiều ví (cash, bank, credit, savings, ewallet, investment)
- ✅ Giao dịch có danh mục với 10+ categories mặc định
- ✅ Chuyển khoản giữa các ví với validation
- ✅ Báo cáo analytics với progress bars và percentages
- ✅ User settings và preferences
- ✅ ATM card design với balance display

---

## 🏗️ Core Database Tables

### 1. **USERS** 👥 - User Management
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

**Nguồn:** Account page - "Nguyễn Văn A", Premium badge, member since

---

### 2. **CATEGORIES** 🏷️ - Transaction Categories
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL, -- Emoji như 🍔, 🚗, 🛍️
    color VARCHAR(20) NOT NULL, -- orange, blue, purple, etc.
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, name)
);
```

**Nguồn:**
- Categories page với CRUD functionality
- CategorySelect component với 10 categories
- Reports page với color-coded categories

**Default Data:**
```sql
INSERT INTO categories (id, user_id, name, icon, color, is_default) VALUES
(uuid_generate_v4(), NULL, 'Ăn uống', '🍔', 'orange', TRUE),
(uuid_generate_v4(), NULL, 'Đi lại', '🚗', 'blue', TRUE),
(uuid_generate_v4(), NULL, 'Mua sắm', '🛍️', 'purple', TRUE),
(uuid_generate_v4(), NULL, 'Giải trí', '🎮', 'green', TRUE),
(uuid_generate_v4(), NULL, 'Y tế', '🏥', 'red', TRUE),
(uuid_generate_v4(), NULL, 'Tiện ích', '⚡', 'yellow', TRUE),
(uuid_generate_v4(), NULL, 'Giáo dục', '📚', 'indigo', TRUE),
(uuid_generate_v4(), NULL, 'Du lịch', '✈️', 'teal', TRUE),
(uuid_generate_v4(), NULL, 'Tiết kiệm', '💰', 'emerald', TRUE),
(uuid_generate_v4(), NULL, 'Khác', '📦', 'gray', TRUE);
```

---

### 3. **WALLET_TYPES** 💼 - Reference Table
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

**Nguồn:** AddWalletForm component với 6 wallet types

---

### 4. **WALLETS** 👛 - User Wallets
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

**Nguồn:**
- Wallet page: "Ví chính" (1,250,000), "Thẻ tín dụng" (5,000,000), "Tài khoản tiết kiệm" (12,500,000)
- Homepage ATM card: 6,250,000 VNĐ
- AddWalletForm: name, type, initial balance, description

---

### 5. **TRANSACTIONS** 💸 - Income & Expense
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

**Nguồn:**
- Add page với type selection: 'expense' | 'income'
- Recent transactions: "Ăn trưa" (-85,000), "Xăng xe" (-200,000), "Lương tháng 12" (+15,000,000)
- Reports summary: +15,000,000 thu nhập, -8,750,000 chi tiêu

---

### 6. **TRANSFERS** 🔄 - Wallet to Wallet
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

**Nguồn:** TransferForm component với từ ví/đến ví selection, swap functionality

---

### 7. **USER_SETTINGS** ⚙️ - User Preferences
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

**Nguồn:** Account page settings menu, Vietnamese language, VND currency

---

## ⚡ Database Triggers & Functions

### Auto Balance Update - Transactions
```sql
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'income' THEN
            UPDATE wallets
            SET current_balance = current_balance + NEW.amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.wallet_id;
        ELSIF NEW.type = 'expense' THEN
            UPDATE wallets
            SET current_balance = current_balance - NEW.amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.wallet_id;
        END IF;
        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        IF OLD.type = 'income' THEN
            UPDATE wallets
            SET current_balance = current_balance - OLD.amount,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = OLD.wallet_id;
        ELSIF OLD.type = 'expense' THEN
            UPDATE wallets
            SET current_balance = current_balance + OLD.amount,
                updated_at = CURRENT_TIMESTAMP
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

### Auto Balance Update - Transfers
```sql
CREATE OR REPLACE FUNCTION update_transfer_balances()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Trừ tiền từ ví nguồn
        UPDATE wallets
        SET current_balance = current_balance - NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.from_wallet_id;

        -- Cộng tiền vào ví đích
        UPDATE wallets
        SET current_balance = current_balance + NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.to_wallet_id;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        -- Hoàn tác transfer
        UPDATE wallets
        SET current_balance = current_balance + OLD.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.from_wallet_id;

        UPDATE wallets
        SET current_balance = current_balance - OLD.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.to_wallet_id;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transfer_balance_trigger
    AFTER INSERT OR DELETE ON transfers
    FOR EACH ROW
    EXECUTE FUNCTION update_transfer_balances();
```

---

## 📊 Analytics Views cho Reports Page

### Monthly Summary View
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

**Output:** Thu nhập: +15,000,000, Chi tiêu: -8,750,000, Tiết kiệm: +6,250,000

### Category Spending với Percentages
```sql
CREATE VIEW category_spending_detail AS
SELECT
    t.user_id,
    c.id as category_id,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    ROUND(
        SUM(t.amount) * 100.0 / NULLIF(SUM(SUM(t.amount)) OVER (
            PARTITION BY t.user_id, DATE_TRUNC('month', t.transaction_date)
        ), 0),
        1
    ) as percentage,
    DATE_TRUNC('month', t.transaction_date) as month
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, c.id, c.name, c.icon, c.color, DATE_TRUNC('month', t.transaction_date);
```

**Output:**
- 🍔 Ăn uống: 3,200,000 VNĐ (36.6%)
- 🛍️ Mua sắm: 2,800,000 VNĐ (32.0%)
- 🚗 Đi lại: 1,500,000 VNĐ (17.1%)
- 🎮 Giải trí: 1,250,000 VNĐ (14.3%)

### User Statistics View
```sql
CREATE VIEW user_statistics AS
SELECT
    u.id as user_id,
    u.full_name,
    COUNT(DISTINCT w.id) as wallet_count,
    COUNT(DISTINCT t.id) as transaction_count,
    (CURRENT_DATE - u.member_since::date) as days_since_joined,
    SUM(w.current_balance) as total_balance
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id AND w.is_active = TRUE
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.full_name, u.member_since;
```

**Output:** 152 giao dịch, 3 ví, 68 ngày sử dụng

---

## 🚀 Performance Indexes

```sql
-- Core user queries
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_transfers_user_id ON transfers(user_id);

-- Reports & analytics
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transfers_date ON transfers(transfer_date);

-- Composite indexes for complex queries
CREATE INDEX idx_transactions_user_type_date ON transactions(user_id, type, transaction_date);
CREATE INDEX idx_transactions_user_category_date ON transactions(user_id, category_id, transaction_date);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, date_trunc('month', transaction_date));
```

---

## 📋 API Query Examples

### Homepage Queries
```sql
-- Total balance
SELECT SUM(current_balance) as total_balance
FROM wallets
WHERE user_id = $1 AND is_active = TRUE;

-- Recent transactions
SELECT
    t.id,
    t.type,
    t.amount,
    t.description,
    t.transaction_date,
    c.name as category_name,
    c.icon as category_icon,
    w.name as wallet_name
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN wallets w ON t.wallet_id = w.id
WHERE t.user_id = $1
ORDER BY t.transaction_date DESC
LIMIT 5;

-- Monthly income/expense for card display
SELECT
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
FROM transactions
WHERE user_id = $1
AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE);
```

### Reports Page Queries
```sql
-- Monthly summary
SELECT * FROM monthly_summary
WHERE user_id = $1
AND month = DATE_TRUNC('month', CURRENT_DATE);

-- Category breakdown with progress
SELECT * FROM category_spending_detail
WHERE user_id = $1
AND month = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY total_amount DESC;
```

### Categories Page Queries
```sql
-- Get all categories for user (default + custom)
SELECT
    c.*,
    COUNT(t.id) as transaction_count
FROM categories c
LEFT JOIN transactions t ON c.id = t.category_id AND t.user_id = $1
WHERE (c.user_id = $1 OR c.is_default = TRUE)
GROUP BY c.id, c.name, c.icon, c.color, c.is_default
ORDER BY c.is_default DESC, c.name;

-- Add new category
INSERT INTO categories (user_id, name, icon, color)
VALUES ($1, $2, $3, $4)
RETURNING *;
```

### Wallet Management Queries
```sql
-- Get user wallets with stats
SELECT
    w.*,
    wt.name as type_name,
    wt.icon as type_icon,
    COUNT(t.id) as transaction_count,
    COALESCE(MAX(t.transaction_date), w.created_at) as last_activity
FROM wallets w
LEFT JOIN wallet_types wt ON w.wallet_type = wt.id
LEFT JOIN transactions t ON w.id = t.wallet_id
WHERE w.user_id = $1 AND w.is_active = TRUE
GROUP BY w.id, wt.name, wt.icon
ORDER BY w.created_at;

-- Add new wallet
INSERT INTO wallets (user_id, name, wallet_type, initial_balance, current_balance, description)
VALUES ($1, $2, $3, $4, $4, $5)
RETURNING *;
```

---

## 🔒 Security & Data Integrity

### Row Level Security (RLS)
```sql
-- Enable RLS on all user tables
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for user data isolation
CREATE POLICY user_wallets_policy ON wallets
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY user_transactions_policy ON transactions
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY user_categories_policy ON categories
    FOR ALL TO authenticated
    USING (user_id = auth.uid() OR is_default = TRUE);
```

### Data Validation
```sql
-- Constraint functions
CREATE OR REPLACE FUNCTION validate_transaction_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.amount <= 0 THEN
        RAISE EXCEPTION 'Transaction amount must be positive';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_transaction_amount_trigger
    BEFORE INSERT OR UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION validate_transaction_amount();
```

---

## 🎯 Implementation Plan

### Phase 1: Foundation (Week 1-2)
1. **Database Setup**: PostgreSQL với UUID extension
2. **Core Tables**: users, categories, wallet_types, wallets
3. **Seed Data**: Default categories và wallet types
4. **Authentication**: NextAuth.js setup

### Phase 2: Core Features (Week 3-4)
1. **Transaction System**: transactions table với auto-balance triggers
2. **Wallet Management**: CRUD operations
3. **Category System**: Default + custom categories
4. **Basic API Routes**: /api/wallets, /api/transactions

### Phase 3: Advanced Features (Week 5-6)
1. **Transfer System**: Wallet-to-wallet transfers
2. **Reports & Analytics**: Views và aggregate queries
3. **User Settings**: Preferences management
4. **Data Export**: CSV export functionality

### Phase 4: Optimization (Week 7-8)
1. **Performance**: Indexes optimization
2. **Security**: RLS implementation
3. **Testing**: Unit tests cho database functions
4. **Documentation**: API documentation

---

## 🛠️ Tools & Technologies

### Database
- **PostgreSQL 15+**: Main database
- **UUID Extension**: For primary keys
- **Triggers & Functions**: Auto-balance calculations

### ORM Options
1. **Prisma** (Recommended):
   - Type-safe với TypeScript
   - Auto-migration generation
   - Excellent developer experience

2. **Drizzle**:
   - Lightweight và fast
   - SQL-like syntax
   - Good for performance-critical apps

### Environment Setup
```env
DATABASE_URL="postgresql://username:password@localhost:5432/money_tracking"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Sample Prisma Schema
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
  avatarUrl    String?  @map("avatar_url")
  isPremium    Boolean  @default(false) @map("is_premium")
  memberSince  DateTime @default(now()) @map("member_since")
  lastLogin    DateTime? @map("last_login")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  wallets      Wallet[]
  transactions Transaction[]
  transfers    Transfer[]
  categories   Category[]
  settings     UserSetting?

  @@map("users")
}
```

Database schema này được thiết kế hoàn toàn dựa trên phân tích source code hiện có và có thể implement ngay lập tức! 🚀