# 🗄️ Database Design - Money Tracking App

## 📋 Tổng Quan

Sau khi review toàn bộ source code của ứng dụng Money Tracking, tôi đề xuất thiết kế database PostgreSQL hoàn chỉnh với các tính năng:

- ✅ **Multi-user support**: Hỗ trợ nhiều người dùng
- ✅ **Multiple wallets**: Nhiều ví/tài khoản mỗi user
- ✅ **Categorized transactions**: Giao dịch có danh mục
- ✅ **Wallet transfers**: Chuyển khoản giữa ví
- ✅ **Auto balance calculation**: Tự động tính số dư
- ✅ **User preferences**: Cài đặt cá nhân
- ✅ **Analytics & reports**: Báo cáo phân tích

---

## 🏗️ Core Database Tables

### 1. **USERS TABLE** 👥
Quản lý thông tin người dùng và tài khoản.

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

**Mapping từ UI:**
- Profile section trong `/account` page
- "Nguyễn Văn A", "nguyenvana@example.com"
- Premium badge, "Thành viên từ: Tháng 1, 2024"

---

### 2. **CATEGORIES TABLE** 🏷️
Quản lý danh mục giao dịch (default + custom).

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

**Mapping từ UI:**
- Categories page: `/categories` với CRUD functionality
- CategorySelect component với 10 default categories
- Mỗi category có: name, icon (emoji), color theme, transaction count

**Default Categories Seed Data:**
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

### 3. **WALLET_TYPES TABLE** 💼
Reference table cho các loại ví.

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

**Mapping từ UI:**
- AddWalletForm component với 6 wallet types
- Mỗi type có icon và description

---

### 4. **WALLETS TABLE** 👛
Quản lý các ví/tài khoản của người dùng.

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

**Mapping từ UI:**
- Wallet page với 3 wallets: "Ví chính" (1,250,000 VNĐ), "Thẻ tín dụng" (5,000,000 VNĐ), "Tài khoản tiết kiệm" (12,500,000 VNĐ)
- AddWalletForm: name, type, initialBalance, description
- ATM card design trong homepage với balance: 6,250,000 VNĐ

---

### 5. **TRANSACTIONS TABLE** 💸
Quản lý giao dịch thu nhập và chi tiêu.

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

**Mapping từ UI:**
- Add page với transaction type selection: 'expense' | 'income'
- Form fields: amount, category (CategorySelect), description
- Recent transactions trong homepage: "Ăn trưa" (-85,000), "Xăng xe" (-200,000), "Lương tháng 12" (+15,000,000)

---

### 6. **TRANSFERS TABLE** 🔄
Quản lý chuyển khoản giữa các ví.

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

**Mapping từ UI:**
- TransferForm component với fromWallet, toWallet selection
- Swap functionality, amount input, note field
- Transfer validation: prevent self-transfer

---

### 7. **USER_SETTINGS TABLE** ⚙️
Cài đặt và preferences của người dùng.

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

**Mapping từ UI:**
- Account page với settings menu: "Cài đặt chung", "Thông báo", "Trợ giúp & Hỗ trợ"
- Currency format: VNĐ throughout the app
- Vietnamese language interface

---

## 🔧 Advanced Features

### 1. **Auto Balance Update Triggers**
Tự động cập nhật số dư ví khi có transaction.

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

### 2. **Transfer Balance Update**
Cập nhật số dư cả 2 ví khi transfer.

```sql
CREATE OR REPLACE FUNCTION update_transfer_balances()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE wallets
        SET current_balance = current_balance - NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.from_wallet_id;

        UPDATE wallets
        SET current_balance = current_balance + NEW.amount,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.to_wallet_id;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
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

## 📊 Analytics Views

### 1. **Monthly Summary View**
Dành cho Reports page - "Tổng quan tháng này".

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

**Mapping từ UI:**
- Reports page: Thu nhập (+15,000,000), Chi tiêu (-8,750,000), Tiết kiệm (+6,250,000)

### 2. **Category Spending View**
Dành cho Reports page - "Chi tiêu theo danh mục".

```sql
CREATE VIEW category_spending AS
SELECT
    t.user_id,
    c.id as category_id,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    ROUND(
        SUM(t.amount) * 100.0 / SUM(SUM(t.amount)) OVER (PARTITION BY t.user_id),
        1
    ) as percentage,
    DATE_TRUNC('month', t.transaction_date) as month
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, c.id, c.name, c.icon, c.color, DATE_TRUNC('month', t.transaction_date);
```

**Mapping từ UI:**
- Reports page với Progress bars:
  - 🍔 Ăn uống: 3,200,000 VNĐ (36.6%)
  - 🛍️ Mua sắm: 2,800,000 VNĐ (32.0%)
  - 🚗 Đi lại: 1,500,000 VNĐ (17.1%)
  - 🎮 Giải trí: 1,250,000 VNĐ (14.3%)

### 3. **User Stats View**
Dành cho Account page statistics.

```sql
CREATE VIEW user_stats AS
SELECT
    u.id as user_id,
    COUNT(DISTINCT w.id) as wallet_count,
    COUNT(DISTINCT t.id) as transaction_count,
    CURRENT_DATE - u.member_since::date as days_since_joined
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id AND w.is_active = TRUE
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.member_since;
```

**Mapping từ UI:**
- Account page quick stats: 152 giao dịch, 3 ví, 68 ngày sử dụng

---

## 🚀 Performance Optimization

### 1. **Essential Indexes**
```sql
-- User-specific queries
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_transfers_user_id ON transfers(user_id);

-- Time-based queries (Reports)
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);

-- Composite indexes for complex queries
CREATE INDEX idx_transactions_user_type_date ON transactions(user_id, type, transaction_date);
CREATE INDEX idx_transactions_user_category_date ON transactions(user_id, category_id, transaction_date);
```

### 2. **Query Examples**

**Lấy total balance của user:**
```sql
SELECT SUM(current_balance) as total_balance
FROM wallets
WHERE user_id = $1 AND is_active = TRUE;
```

**Recent transactions cho homepage:**
```sql
SELECT
    t.id,
    t.type,
    t.amount,
    t.description,
    t.transaction_date,
    c.name as category_name,
    c.icon as category_icon
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.user_id = $1
ORDER BY t.transaction_date DESC
LIMIT 10;
```

**Monthly income/expense summary:**
```sql
SELECT
    type,
    SUM(amount) as total
FROM transactions
WHERE user_id = $1
AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY type;
```

---

## 🔗 Data Relationships

```
USERS (1) -----> (M) WALLETS
USERS (1) -----> (M) TRANSACTIONS
USERS (1) -----> (M) TRANSFERS
USERS (1) -----> (M) CATEGORIES
USERS (1) -----> (1) USER_SETTINGS

WALLETS (1) -----> (M) TRANSACTIONS
WALLETS (1) -----> (M) TRANSFERS (as source)
WALLETS (1) -----> (M) TRANSFERS (as destination)
WALLET_TYPES (1) -----> (M) WALLETS

CATEGORIES (1) -----> (M) TRANSACTIONS
```

---

## 🎯 Implementation Roadmap

### Phase 1: Core Setup
1. **Database Creation**: PostgreSQL database với UUID extension
2. **Core Tables**: users, categories, wallet_types, wallets
3. **Basic CRUD**: User registration, wallet management
4. **Authentication**: NextAuth.js integration

### Phase 2: Transactions
1. **Transaction System**: transactions table với triggers
2. **Category Management**: Dynamic categories với UI
3. **Balance Calculation**: Auto-update triggers
4. **Transaction Forms**: Add/Edit/Delete operations

### Phase 3: Advanced Features
1. **Transfer System**: Wallet-to-wallet transfers
2. **Analytics**: Reports page với views
3. **User Settings**: Preferences và customization
4. **Data Export**: CSV/PDF export functionality

### Phase 4: Optimization
1. **Performance**: Indexes và query optimization
2. **Security**: Row Level Security (RLS)
3. **Backup**: Database backup strategy
4. **Monitoring**: Query performance monitoring

---

## 🔒 Security Best Practices

1. **Row Level Security (RLS)**:
```sql
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_wallets ON wallets FOR ALL TO authenticated USING (user_id = auth.uid());
```

2. **Input Validation**:
- Positive amounts only
- Valid email formats
- SQL injection prevention

3. **Authentication**:
- JWT tokens với expiration
- Password hashing với bcrypt
- Rate limiting cho login attempts

4. **Data Privacy**:
- User data isolation
- Secure password storage
- GDPR compliance ready

---

## 📦 Technology Stack Recommendations

### Backend:
- **Database**: PostgreSQL 15+
- **ORM**: Prisma (type-safe) hoặc Drizzle (lightweight)
- **API**: Next.js API Routes
- **Auth**: NextAuth.js

### Frontend:
- **Framework**: Next.js 15 (đã có)
- **UI**: Shadcn UI (đã có)
- **State**: React hooks + Context API
- **Forms**: React Hook Form + Zod validation

### DevOps:
- **Hosting**: Vercel (frontend) + Supabase (database)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry for error tracking
- **Analytics**: PostHog for user analytics

Schema này được thiết kế dựa trên phân tích chi tiết UI/UX hiện có và có thể mở rộng cho các tính năng tương lai! 🚀