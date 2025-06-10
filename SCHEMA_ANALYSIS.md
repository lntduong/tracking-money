# 🗄️ Database Schema Analysis - Money Tracking App

## 📋 Source Code Review Summary

Tôi đã review chi tiết toàn bộ source code và đây là phân tích hoàn chỉnh về database requirements:

### ✅ Pages Analyzed:
- **HomePage**: ATM card balance (6,250,000 VNĐ), quick actions, recent transactions
- **WalletPage**: 3 wallets với different types và balances
- **AddPage**: Transaction form với income/expense toggle
- **CategoriesPage**: Full CRUD cho categories với icons và colors
- **TransferPage**: Inter-wallet transfers với validation
- **ReportsPage**: Monthly analytics với progress bars
- **AccountPage**: User profile, stats, settings

### ✅ Components Analyzed:
- **CategorySelect**: 10 default categories
- **AddWalletForm**: 6 wallet types với icons
- **TransferForm**: From/to wallet selection với swap
- **BottomNav**: 5-item navigation

---

## 🏗️ Complete PostgreSQL Schema

### 1. **USERS** 👥
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

### 2. **CATEGORIES** 🏷️
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

-- Default categories từ CategorySelect component
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

### 3. **WALLET_TYPES** 💼
```sql
CREATE TABLE wallet_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    description TEXT
);

-- Data từ AddWalletForm component
INSERT INTO wallet_types VALUES
('cash', 'Tiền mặt', '💵', 'Tiền mặt cầm tay'),
('bank', 'Tài khoản ngân hàng', '🏦', 'Tài khoản ngân hàng thông thường'),
('credit', 'Thẻ tín dụng', '💳', 'Thẻ tín dụng và thẻ ghi nợ'),
('savings', 'Tài khoản tiết kiệm', '💰', 'Tài khoản tiết kiệm có lãi suất'),
('ewallet', 'Ví điện tử', '📱', 'Ví điện tử (MoMo, ZaloPay, ...)'),
('investment', 'Tài khoản đầu tư', '📈', 'Tài khoản đầu tư chứng khoán');
```

### 4. **WALLETS** 👛
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
**Sample data từ WalletPage:**
- Ví chính: 1,250,000 VNĐ
- Thẻ tín dụng: 5,000,000 VNĐ
- Tài khoản tiết kiệm: 12,500,000 VNĐ

### 5. **TRANSACTIONS** 💸
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
**Sample data từ HomePage recent transactions:**
- "Ăn trưa": -85,000 VNĐ (expense)
- "Xăng xe": -200,000 VNĐ (expense)
- "Lương tháng 12": +15,000,000 VNĐ (income)

### 6. **TRANSFERS** 🔄
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

### 7. **USER_SETTINGS** ⚙️
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

## ⚡ Auto-Balance System

### Transaction Trigger
```sql
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.type = 'income' THEN
            UPDATE wallets SET current_balance = current_balance + NEW.amount
            WHERE id = NEW.wallet_id;
        ELSE
            UPDATE wallets SET current_balance = current_balance - NEW.amount
            WHERE id = NEW.wallet_id;
        END IF;
        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        IF OLD.type = 'income' THEN
            UPDATE wallets SET current_balance = current_balance - OLD.amount
            WHERE id = OLD.wallet_id;
        ELSE
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
    FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();
```

### Transfer Trigger
```sql
CREATE OR REPLACE FUNCTION update_transfer_balances()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE wallets SET current_balance = current_balance - NEW.amount
        WHERE id = NEW.from_wallet_id;

        UPDATE wallets SET current_balance = current_balance + NEW.amount
        WHERE id = NEW.to_wallet_id;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        UPDATE wallets SET current_balance = current_balance + OLD.amount
        WHERE id = OLD.from_wallet_id;

        UPDATE wallets SET current_balance = current_balance - OLD.amount
        WHERE id = OLD.to_wallet_id;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transfer_balance_trigger
    AFTER INSERT OR DELETE ON transfers
    FOR EACH ROW EXECUTE FUNCTION update_transfer_balances();
```

---

## 📊 Analytics Views (Reports Page)

### Monthly Summary
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

### Category Breakdown
```sql
CREATE VIEW category_analysis AS
SELECT
    t.user_id,
    c.name, c.icon, c.color,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    ROUND(SUM(t.amount) * 100.0 / NULLIF(SUM(SUM(t.amount)) OVER
        (PARTITION BY t.user_id, DATE_TRUNC('month', t.transaction_date)), 0), 1) as percentage
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, c.id, c.name, c.icon, c.color, DATE_TRUNC('month', t.transaction_date);
```

**ReportsPage data mapping:**
- 🍔 Ăn uống: 3,200,000 VNĐ (36.6%)
- 🛍️ Mua sắm: 2,800,000 VNĐ (32.0%)
- 🚗 Đi lại: 1,500,000 VNĐ (17.1%)
- 🎮 Giải trí: 1,250,000 VNĐ (14.3%)

---

## 🚀 Essential Indexes

```sql
-- User data access
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_transfers_user_id ON transfers(user_id);

-- Time-based queries
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- Complex analytics
CREATE INDEX idx_transactions_user_type_date ON transactions(user_id, type, transaction_date);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, date_trunc('month', transaction_date));
```

---

## 📋 Key API Queries

### HomePage
```sql
-- ATM card total balance
SELECT COALESCE(SUM(current_balance), 0) as total_balance
FROM wallets WHERE user_id = $1 AND is_active = TRUE;

-- Recent transactions
SELECT t.*, c.name as category_name, c.icon
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1
ORDER BY t.transaction_date DESC LIMIT 5;

-- Monthly summary
SELECT
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
FROM transactions
WHERE user_id = $1
AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE);
```

### ReportsPage
```sql
-- Current month summary
SELECT * FROM monthly_summary
WHERE user_id = $1 AND month = DATE_TRUNC('month', CURRENT_DATE);

-- Category breakdown
SELECT * FROM category_analysis
WHERE user_id = $1
ORDER BY total_amount DESC;
```

### WalletPage
```sql
-- User wallets with types
SELECT w.*, wt.name as type_name, wt.icon as type_icon
FROM wallets w
LEFT JOIN wallet_types wt ON w.wallet_type = wt.id
WHERE w.user_id = $1 AND w.is_active = TRUE
ORDER BY w.created_at;
```

### CategoriesPage
```sql
-- All categories (default + custom) with transaction counts
SELECT c.*, COALESCE(t.count, 0) as transaction_count
FROM categories c
LEFT JOIN (
    SELECT category_id, COUNT(*) as count
    FROM transactions WHERE user_id = $1
    GROUP BY category_id
) t ON c.id = t.category_id
WHERE (c.user_id = $1 OR c.is_default = TRUE)
ORDER BY c.is_default DESC, c.name;
```

---

## 🔗 Relationships Summary

```
users (1:M) wallets
users (1:M) transactions
users (1:M) transfers
users (1:M) categories (custom only)
users (1:1) user_settings

wallet_types (1:M) wallets
wallets (1:M) transactions
wallets (1:M) transfers (from)
wallets (1:M) transfers (to)

categories (1:M) transactions
```

---

## 🛠️ Implementation Guide

### 1. Database Setup
```bash
# PostgreSQL database
createdb money_tracking_app
psql money_tracking_app -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Run schema
psql money_tracking_app < schema.sql
```

### 2. ORM Setup (Prisma)
```bash
npm install prisma @prisma/client
npx prisma init
```

### 3. Environment
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/money_tracking_app"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. API Structure
```
/api/
├── auth/           # NextAuth authentication
├── users/          # User management
├── wallets/        # Wallet CRUD
├── transactions/   # Transaction management
├── transfers/      # Wallet transfers
├── categories/     # Category management
└── reports/        # Analytics queries
```

---

## 📈 Data Flow Examples

### Adding Transaction
1. User submits form từ `/add` page
2. API validates data (amount > 0, valid category, valid wallet)
3. Insert vào `transactions` table
4. Trigger auto-updates `wallets.current_balance`
5. Return success response

### Monthly Reports
1. User visits `/reports` page
2. API queries `monthly_summary` view cho current month
3. API queries `category_analysis` view cho progress bars
4. Frontend renders charts với percentages

### Wallet Transfer
1. User submits TransferForm
2. API validates (from ≠ to, sufficient balance)
3. Insert vào `transfers` table
4. Trigger updates cả 2 wallets' balances
5. Return updated balances

---

## 🎯 Production Considerations

### Security
- Row Level Security (RLS) cho user data isolation
- Input validation và sanitization
- API rate limiting
- Password hashing với bcrypt

### Performance
- Database connection pooling
- Query optimization cho analytics
- Caching cho frequently accessed data
- Proper indexing strategy

### Monitoring
- Database performance monitoring
- Error tracking với Sentry
- User analytics với PostHog
- Backup strategy

Schema này hoàn toàn dựa trên phân tích source code và sẵn sàng implement! 🚀