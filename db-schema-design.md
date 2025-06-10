# 💰 Money Tracking App - Database Schema Design

## 📊 Source Code Analysis Summary

Sau khi review toàn bộ source code, tôi phân tích được các requirements sau:

### UI Components Analyzed:
- ✅ **HomePage**: ATM card design, quick actions, recent transactions
- ✅ **WalletPage**: Multiple wallets with balances và types
- ✅ **AddPage**: Transaction form với income/expense toggle
- ✅ **CategoriesPage**: CRUD operations cho categories
- ✅ **TransferPage**: Wallet-to-wallet transfer functionality
- ✅ **ReportsPage**: Analytics với progress bars và percentages
- ✅ **AccountPage**: User profile và settings

### Data Structures Identified:
- User accounts với premium features
- 6 wallet types (cash, bank, credit, savings, ewallet, investment)
- 10+ transaction categories với icons và colors
- Income/expense transactions với amounts
- Inter-wallet transfers với validation
- Real-time balance calculations
- Monthly summaries và category breakdowns

---

## 🏗️ PostgreSQL Database Schema

### 1. **USERS TABLE** 👥
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

**Based on:** Account page showing "Nguyễn Văn A", email, Premium badge, member since date

### 2. **CATEGORIES TABLE** 🏷️
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL, -- Emoji icons like 🍔, 🚗
    color VARCHAR(20) NOT NULL, -- Color themes: orange, blue, purple
    is_default BOOLEAN DEFAULT FALSE, -- System vs user categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, name) -- Prevent duplicate names per user
);

-- Default categories seed data
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

**Based on:** Categories page với add/edit/delete functionality, CategorySelect component

### 3. **WALLET_TYPES TABLE** 💼
```sql
CREATE TABLE wallet_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    description TEXT
);

INSERT INTO wallet_types (id, name, icon, description) VALUES
('cash', 'Tiền mặt', '💵', 'Tiền mặt cầm tay'),
('bank', 'Tài khoản ngân hàng', '🏦', 'Tài khoản ngân hàng thông thường'),
('credit', 'Thẻ tín dụng', '💳', 'Thẻ tín dụng và thẻ ghi nợ'),
('savings', 'Tài khoản tiết kiệm', '💰', 'Tài khoản tiết kiệm có lãi suất'),
('ewallet', 'Ví điện tử', '📱', 'Ví điện tử (MoMo, ZaloPay, ...)'),
('investment', 'Tài khoản đầu tư', '📈', 'Tài khoản đầu tư chứng khoán');
```

**Based on:** AddWalletForm component với 6 wallet types

### 4. **WALLETS TABLE** 👛
```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    wallet_type VARCHAR(20) REFERENCES wallet_types(id),
    initial_balance DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0, -- Auto-calculated
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Based on:**
- Wallet page: "Ví chính" (1,250,000 VNĐ), "Thẻ tín dụng" (5,000,000 VNĐ), "Tài khoản tiết kiệm" (12,500,000 VNĐ)
- Homepage ATM card design: 6,250,000 VNĐ total balance

### 5. **TRANSACTIONS TABLE** 💸
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

**Based on:**
- Add page với transaction type selection: expense/income
- Recent transactions: "Ăn trưa" (-85,000 VNĐ), "Xăng xe" (-200,000 VNĐ), "Lương tháng 12" (+15,000,000 VNĐ)
- Reports data: +15,000,000 thu nhập, -8,750,000 chi tiêu

### 6. **TRANSFERS TABLE** 🔄
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

    CHECK (from_wallet_id != to_wallet_id) -- Prevent self-transfer
);
```

**Based on:** TransferForm component với from/to wallet selection, swap functionality

### 7. **USER_SETTINGS TABLE** ⚙️
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

**Based on:** Account page settings menu, Vietnamese interface, VND currency formatting

---

## ⚡ Auto-Balance Calculation Triggers

### Transaction Balance Update
```sql
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Add income or subtract expense
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
        -- Reverse the balance change
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

### Transfer Balance Update
```sql
CREATE OR REPLACE FUNCTION update_transfer_balances()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Subtract from source wallet
        UPDATE wallets
        SET current_balance = current_balance - NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.from_wallet_id;

        -- Add to destination wallet
        UPDATE wallets
        SET current_balance = current_balance + NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.to_wallet_id;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        -- Reverse the transfer
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

## 📊 Analytics Views for Reports Page

### Monthly Summary View
```sql
CREATE VIEW monthly_transaction_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', transaction_date) as month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_savings
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', transaction_date);
```

**Outputs:** Thu nhập: +15,000,000, Chi tiêu: -8,750,000, Tiết kiệm: +6,250,000

### Category Spending with Percentages
```sql
CREATE VIEW category_spending_analysis AS
SELECT
    t.user_id,
    c.id as category_id,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    ROUND(
        SUM(t.amount) * 100.0 / NULLIF(
            SUM(SUM(t.amount)) OVER (
                PARTITION BY t.user_id, DATE_TRUNC('month', t.transaction_date)
            ), 0
        ), 1
    ) as percentage,
    DATE_TRUNC('month', t.transaction_date) as month
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, c.id, c.name, c.icon, c.color, DATE_TRUNC('month', t.transaction_date);
```

**Outputs:**
- 🍔 Ăn uống: 3,200,000 VNĐ (36.6%)
- 🛍️ Mua sắm: 2,800,000 VNĐ (32.0%)
- 🚗 Đi lại: 1,500,000 VNĐ (17.1%)
- 🎮 Giải trí: 1,250,000 VNĐ (14.3%)

### User Statistics View
```sql
CREATE VIEW user_dashboard_stats AS
SELECT
    u.id as user_id,
    u.full_name,
    COUNT(DISTINCT w.id) as wallet_count,
    COUNT(DISTINCT t.id) as transaction_count,
    (CURRENT_DATE - u.member_since::date) as days_since_joined,
    COALESCE(SUM(w.current_balance), 0) as total_balance
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id AND w.is_active = TRUE
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.full_name, u.member_since;
```

**Outputs:** 152 giao dịch, 3 ví, 68 ngày sử dụng (Account page quick stats)

---

## 🚀 Performance Indexes

```sql
-- Primary user-based queries
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_transfers_user_id ON transfers(user_id);

-- Time-based queries for reports
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transfers_date ON transfers(transfer_date);

-- Composite indexes for complex analytics
CREATE INDEX idx_transactions_user_type_date ON transactions(user_id, type, transaction_date);
CREATE INDEX idx_transactions_user_category_date ON transactions(user_id, category_id, transaction_date);
CREATE INDEX idx_transactions_user_month ON transactions(user_id, date_trunc('month', transaction_date));
```

---

## 📋 API Query Examples

### Homepage Queries
```sql
-- Total user balance (ATM card display)
SELECT COALESCE(SUM(current_balance), 0) as total_balance
FROM wallets
WHERE user_id = $1 AND is_active = TRUE;

-- Recent transactions list
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

-- Monthly income/expense for card summary
SELECT
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as monthly_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as monthly_expense
FROM transactions
WHERE user_id = $1
AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE);
```

### Reports Page Queries
```sql
-- Monthly overview summary
SELECT * FROM monthly_transaction_summary
WHERE user_id = $1
AND month = DATE_TRUNC('month', CURRENT_DATE);

-- Category breakdown with progress bars
SELECT * FROM category_spending_analysis
WHERE user_id = $1
AND month = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY total_amount DESC;
```

### Wallet Management Queries
```sql
-- User wallets with type info
SELECT
    w.*,
    wt.name as type_name,
    wt.icon as type_icon,
    COUNT(t.id) as transaction_count
FROM wallets w
LEFT JOIN wallet_types wt ON w.wallet_type = wt.id
LEFT JOIN transactions t ON w.id = t.wallet_id
WHERE w.user_id = $1 AND w.is_active = TRUE
GROUP BY w.id, wt.name, wt.icon
ORDER BY w.created_at;

-- Available wallets for transfers
SELECT id, name, current_balance, wallet_type
FROM wallets
WHERE user_id = $1 AND is_active = TRUE
ORDER BY name;
```

### Categories Management Queries
```sql
-- Get all categories (default + user custom)
SELECT
    c.*,
    COALESCE(t.transaction_count, 0) as transaction_count
FROM categories c
LEFT JOIN (
    SELECT category_id, COUNT(*) as transaction_count
    FROM transactions
    WHERE user_id = $1
    GROUP BY category_id
) t ON c.id = t.category_id
WHERE (c.user_id = $1 OR c.is_default = TRUE)
ORDER BY c.is_default DESC, c.name;

-- Add new custom category
INSERT INTO categories (user_id, name, icon, color)
VALUES ($1, $2, $3, $4)
RETURNING *;
```

---

## 🔗 Entity Relationships

```
users (1) -----> (*) wallets
users (1) -----> (*) transactions
users (1) -----> (*) transfers
users (1) -----> (*) categories (custom)
users (1) -----> (1) user_settings

wallet_types (1) -----> (*) wallets
wallets (1) -----> (*) transactions
wallets (1) -----> (*) transfers (as from_wallet)
wallets (1) -----> (*) transfers (as to_wallet)

categories (1) -----> (*) transactions
```

---

## 🎯 Implementation Roadmap

### Phase 1: Core Setup (Week 1-2)
1. PostgreSQL database setup với UUID extension
2. Core tables: users, categories, wallet_types, wallets
3. Seed data: default categories và wallet types
4. Basic authentication setup

### Phase 2: Transaction System (Week 3-4)
1. Transactions table với auto-balance triggers
2. CRUD operations cho transactions
3. Category management với custom categories
4. Basic API routes implementation

### Phase 3: Advanced Features (Week 5-6)
1. Transfer system với validation
2. Analytics views cho reports
3. User settings management
4. Real-time balance updates

### Phase 4: Optimization (Week 7-8)
1. Performance indexes optimization
2. Query optimization for complex reports
3. Security implementation (RLS)
4. Data export functionality

---

## 🛠️ Technology Stack

### Database & ORM
```bash
# PostgreSQL setup
npm install prisma @prisma/client
npx prisma init

# Environment setup
DATABASE_URL="postgresql://username:password@localhost:5432/money_tracking"
```

### Sample Prisma Schema Preview
```prisma
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
  settings     UserSetting?

  @@map("users")
}

model Transaction {
  id              String   @id @default(uuid()) @db.Uuid
  userId          String   @map("user_id") @db.Uuid
  walletId        String   @map("wallet_id") @db.Uuid
  categoryId      String?  @map("category_id") @db.Uuid
  type            String   // 'income' | 'expense'
  amount          Decimal  @db.Decimal(15, 2)
  description     String?
  transactionDate DateTime @default(now()) @map("transaction_date")

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  wallet   Wallet    @relation(fields: [walletId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@map("transactions")
}
```

---

## 🔒 Security & Best Practices

### Row Level Security
```sql
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_data_policy ON wallets FOR ALL TO authenticated
USING (user_id = auth.uid());
```

### Data Validation
- Amount validation (positive numbers only)
- Email format validation
- Unique constraints on critical fields
- Foreign key constraints for data integrity
- Check constraints for enum values

### Performance Considerations
- Proper indexing strategy
- Query optimization for analytics
- Connection pooling
- Database monitoring

Database schema này được thiết kế hoàn toàn dựa trên phân tích chi tiết source code hiện có và sẵn sàng implement! 🚀