# 🗄️ Database Design - Money Tracking App

## 📋 Tổng Quan

Database được thiết kế cho ứng dụng theo dõi chi tiêu sử dụng **PostgreSQL** với các tính năng:
- ✅ Multi-user support
- ✅ Multiple wallets per user
- ✅ Categorized transactions
- ✅ Wallet-to-wallet transfers
- ✅ Automated balance calculations
- ✅ User settings & preferences
- ✅ Budget planning (future feature)

---

## 🏗️ Database Schema

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

**Fields:**
- `id`: UUID primary key
- `email`: Email đăng nhập (unique)
- `password_hash`: Mật khẩu đã hash
- `full_name`: Họ tên đầy đủ
- `avatar_url`: Link ảnh đại diện
- `is_premium`: Tài khoản Premium
- `member_since`: Ngày tham gia
- `last_login`: Lần đăng nhập cuối

---

### 2. **CATEGORIES TABLE** 🏷️
Quản lý danh mục giao dịch (system default + user custom).

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

**Features:**
- System default categories (user_id = NULL)
- User custom categories
- Icon emoji support
- Color themes
- Prevent duplicate names per user

**Default Categories:**
- 🍔 Ăn uống (orange)
- 🚗 Đi lại (blue)
- 🛍️ Mua sắm (purple)
- 🎮 Giải trí (green)
- 🏥 Y tế (red)
- ⚡ Tiện ích (yellow)
- 📚 Giáo dục (indigo)
- ✈️ Du lịch (teal)
- 💰 Tiết kiệm (emerald)
- 📦 Khác (gray)

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
```

**Wallet Types:**
- `cash`: 💵 Tiền mặt
- `bank`: 🏦 Tài khoản ngân hàng
- `credit`: 💳 Thẻ tín dụng
- `savings`: 💰 Tài khoản tiết kiệm
- `ewallet`: 📱 Ví điện tử
- `investment`: 📈 Tài khoản đầu tư

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

**Features:**
- Multiple wallets per user
- Different wallet types
- Auto-calculated current balance
- Soft delete with is_active flag

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

**Features:**
- Income/Expense transactions
- Linked to wallet and category
- Auto-updates wallet balance via trigger
- Amount validation (positive only)

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

**Features:**
- Wallet-to-wallet transfers
- Prevents self-transfer
- Auto-updates both wallet balances via trigger

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

---

### 8. **BUDGET_PLANS TABLE** 📊 *(Future Feature)*
Kế hoạch ngân sách và theo dõi chi tiêu.

```sql
CREATE TABLE budget_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    budget_amount DECIMAL(15,2) NOT NULL CHECK (budget_amount > 0),
    spent_amount DECIMAL(15,2) DEFAULT 0,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('monthly', 'weekly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Database Triggers & Functions

### 1. **Auto Balance Update - Transactions**
Tự động cập nhật số dư ví khi thêm/xóa giao dịch.

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
        -- Reverse balance changes
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
```

### 2. **Auto Balance Update - Transfers**
Tự động cập nhật số dư cả 2 ví khi chuyển khoản.

```sql
CREATE OR REPLACE FUNCTION update_transfer_balances()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Deduct from source, add to destination
        UPDATE wallets SET current_balance = current_balance - NEW.amount
        WHERE id = NEW.from_wallet_id;

        UPDATE wallets SET current_balance = current_balance + NEW.amount
        WHERE id = NEW.to_wallet_id;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        -- Reverse the transfer
        UPDATE wallets SET current_balance = current_balance + OLD.amount
        WHERE id = OLD.from_wallet_id;

        UPDATE wallets SET current_balance = current_balance - OLD.amount
        WHERE id = OLD.to_wallet_id;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

## 📈 Database Views

### 1. **Wallet Summary View**
Tổng hợp thông tin ví với statistics.

```sql
CREATE VIEW wallet_summary AS
SELECT
    w.id,
    w.user_id,
    w.name,
    wt.name as wallet_type_name,
    wt.icon as wallet_type_icon,
    w.current_balance,
    COUNT(t.id) as transaction_count,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expense
FROM wallets w
LEFT JOIN wallet_types wt ON w.wallet_type = wt.id
LEFT JOIN transactions t ON w.id = t.wallet_id
WHERE w.is_active = TRUE
GROUP BY w.id, w.user_id, w.name, wt.name, wt.icon, w.current_balance;
```

### 2. **Monthly Transaction Summary**
Báo cáo tổng hợp theo tháng.

```sql
CREATE VIEW monthly_transaction_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', transaction_date) as month,
    type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', transaction_date), type;
```

### 3. **Category Spending Summary**
Phân tích chi tiêu theo danh mục.

```sql
CREATE VIEW category_spending_summary AS
SELECT
    t.user_id,
    c.id as category_id,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount,
    DATE_TRUNC('month', t.transaction_date) as month
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, c.id, c.name, c.icon, c.color, DATE_TRUNC('month', t.transaction_date);
```

---

## 🚀 Performance Indexes

```sql
-- User-related queries
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

-- Composite indexes for common queries
CREATE INDEX idx_transactions_user_type_date ON transactions(user_id, type, transaction_date);
CREATE INDEX idx_transactions_user_category_date ON transactions(user_id, category_id, transaction_date);
```

---

## 🔗 Mối Quan Hệ Tables

```mermaid
erDiagram
    USERS ||--o{ WALLETS : owns
    USERS ||--o{ TRANSACTIONS : creates
    USERS ||--o{ TRANSFERS : performs
    USERS ||--o{ CATEGORIES : customizes
    USERS ||--|| USER_SETTINGS : has

    WALLETS ||--o{ TRANSACTIONS : contains
    WALLETS ||--o{ TRANSFERS : from_wallet
    WALLETS ||--o{ TRANSFERS : to_wallet
    WALLET_TYPES ||--o{ WALLETS : type

    CATEGORIES ||--o{ TRANSACTIONS : categorizes
    CATEGORIES ||--o{ BUDGET_PLANS : tracks

    USERS ||--o{ BUDGET_PLANS : plans
```

---

## 📊 Sample Queries

### Lấy tổng số dư của user
```sql
SELECT SUM(current_balance) as total_balance
FROM wallets
WHERE user_id = ? AND is_active = TRUE;
```

### Thu nhập/Chi tiêu tháng này
```sql
SELECT
    type,
    SUM(amount) as total
FROM transactions
WHERE user_id = ?
AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY type;
```

### Top 5 danh mục chi tiêu nhiều nhất
```sql
SELECT
    c.name,
    c.icon,
    SUM(t.amount) as total_spent
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.user_id = ? AND t.type = 'expense'
AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
GROUP BY c.id, c.name, c.icon
ORDER BY total_spent DESC
LIMIT 5;
```

---

## 🎯 Đề Xuất Implementation

### 1. **Database Setup**
```bash
# Install PostgreSQL
# Create database
createdb money_tracking_app

# Run schema
psql money_tracking_app < database-schema.sql
```

### 2. **ORM Integration** (Next.js)
- **Prisma**: Type-safe ORM cho PostgreSQL
- **Drizzle**: Lightweight TypeScript ORM
- **TypeORM**: Feature-rich ORM

### 3. **Environment Variables**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/money_tracking_app"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. **API Routes Structure**
```
/api/
├── auth/           # Authentication
├── users/          # User management
├── wallets/        # Wallet CRUD
├── transactions/   # Transaction CRUD
├── transfers/      # Transfer operations
├── categories/     # Category management
└── reports/        # Analytics & reports
```

---

## 🔒 Security Considerations

1. **Row Level Security (RLS)**: Ensure users only access their data
2. **Password Hashing**: Use bcrypt for password security
3. **JWT Authentication**: Secure API endpoints
4. **Input Validation**: Prevent SQL injection
5. **Rate Limiting**: Prevent abuse

---

## 📝 Migration Strategy

1. **Initial Migration**: Create all tables
2. **Seed Data**: Insert default categories & wallet types
3. **User Migration**: Import existing user data
4. **Transaction Migration**: Migrate transaction history
5. **Balance Reconciliation**: Verify wallet balances

Database schema này cung cấp foundation mạnh mẽ cho ứng dụng money tracking với khả năng mở rộng cao! 🚀