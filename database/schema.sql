-- ================================================
-- MONEY TRACKING APP - DATABASE SCHEMA
-- PostgreSQL Database Design
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- USERS TABLE
-- ================================================
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

-- ================================================
-- CATEGORIES TABLE
-- ================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL, -- Emoji icons
    color VARCHAR(20) NOT NULL, -- Color theme
    is_default BOOLEAN DEFAULT FALSE, -- System default categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, name) -- Prevent duplicate category names per user
);

-- ================================================
-- WALLET TYPES TABLE (Reference)
-- ================================================
CREATE TABLE wallet_types (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    description TEXT
);

-- Insert default wallet types
INSERT INTO wallet_types (id, name, icon, description) VALUES
('cash', 'Tiền mặt', '💵', 'Tiền mặt cầm tay'),
('bank', 'Tài khoản ngân hàng', '🏦', 'Tài khoản ngân hàng thông thường'),
('credit', 'Thẻ tín dụng', '💳', 'Thẻ tín dụng và thẻ ghi nợ'),
('savings', 'Tài khoản tiết kiệm', '💰', 'Tài khoản tiết kiệm có lãi suất'),
('ewallet', 'Ví điện tử', '📱', 'Ví điện tử (MoMo, ZaloPay, ...)'),
('investment', 'Tài khoản đầu tư', '📈', 'Tài khoản đầu tư chứng khoán');

-- ================================================
-- WALLETS TABLE
-- ================================================
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

-- ================================================
-- TRANSACTIONS TABLE
-- ================================================
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

-- ================================================
-- TRANSFERS TABLE
-- ================================================
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

-- ================================================
-- USER SETTINGS TABLE
-- ================================================
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

-- ================================================
-- BUDGET PLANS TABLE (Future Feature)
-- ================================================
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

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

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

-- ================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ================================================

-- Update wallet balance after transaction
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update current balance based on transaction type
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

-- Update wallet balances after transfer
CREATE OR REPLACE FUNCTION update_transfer_balances()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Deduct from source wallet
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

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DEFAULT CATEGORIES SEED DATA
-- ================================================
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

-- ================================================
-- VIEWS FOR COMMON QUERIES
-- ================================================

-- Wallet summary view
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

-- Monthly transaction summary view
CREATE VIEW monthly_transaction_summary AS
SELECT
    user_id,
    DATE_TRUNC('month', transaction_date) as month,
    type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM transactions
GROUP BY user_id, DATE_TRUNC('month', transaction_date), type;

-- Category spending summary view
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

-- ================================================
-- COMMENTS
-- ================================================

COMMENT ON TABLE users IS 'User accounts and profile information';
COMMENT ON TABLE categories IS 'Transaction categories (both default and user-created)';
COMMENT ON TABLE wallets IS 'User wallets/accounts for storing money';
COMMENT ON TABLE transactions IS 'Individual income/expense transactions';
COMMENT ON TABLE transfers IS 'Money transfers between wallets';
COMMENT ON TABLE wallet_types IS 'Reference table for wallet types';
COMMENT ON TABLE user_settings IS 'User preferences and settings';
COMMENT ON TABLE budget_plans IS 'Budget planning and tracking (future feature)';

-- ================================================
-- END OF SCHEMA
-- ================================================