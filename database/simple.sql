-- ================================================
-- SIMPLE SQL SCHEMA - Money Tracking App
-- ================================================

-- Create tables

-- Users table
create table users (
   id            uuid primary key default gen_random_uuid(),
   email         varchar(255) unique not null,
   password_hash varchar(255) not null,
   full_name     varchar(255) not null,
   avatar_url    varchar(255),
   is_premium    boolean default false,
   member_since  timestamp default current_timestamp,
   last_login    timestamp,
   created_at    timestamp default current_timestamp,
   updated_at    timestamp default current_timestamp
);

-- User settings table
create table user_settings (
   user_id              uuid primary key
      references users ( id )
         on delete cascade,
   currency             varchar(10) default 'VND',
   language             varchar(10) default 'vi',
   timezone             varchar(50) default 'Asia/Ho_Chi_Minh',
   notification_enabled boolean default true,
   email_notifications  boolean default true,
   theme                varchar(20) default 'light',
   created_at           timestamp default current_timestamp,
   updated_at           timestamp default current_timestamp
);

-- Wallet types reference table
create table wallet_types (
   id          varchar(20) primary key,
   name        varchar(50) not null,
   icon        varchar(10) not null,
   description text
);

-- Wallets table
create table wallets (
   id              uuid primary key default gen_random_uuid(),
   user_id         uuid
      references users ( id )
         on delete cascade,
   name            varchar(255) not null,
   wallet_type     varchar(20)
      references wallet_types ( id ),
   initial_balance decimal(15,2) default 0,
   current_balance decimal(15,2) default 0,
   description     text,
   is_active       boolean default true,
   created_at      timestamp default current_timestamp,
   updated_at      timestamp default current_timestamp
);

-- Categories table
create table categories (
   id         uuid primary key default gen_random_uuid(),
   user_id    uuid
      references users ( id )
         on delete cascade,
   name       varchar(100) not null,
   icon       varchar(10) not null,
   color      varchar(20) not null,
   is_default boolean default false,
   created_at timestamp default current_timestamp,
   updated_at timestamp default current_timestamp,
   unique ( user_id,
            name )
);

-- Transactions table
create table transactions (
   id               uuid primary key default gen_random_uuid(),
   user_id          uuid
      references users ( id )
         on delete cascade,
   wallet_id        uuid
      references wallets ( id )
         on delete cascade,
   category_id      uuid
      references categories ( id )
         on delete set null,
   type             varchar(10) not null check ( type in ( 'income',
                                               'expense' ) ),
   amount           decimal(15,2) not null check ( amount > 0 ),
   description      text,
   transaction_date timestamp default current_timestamp,
   created_at       timestamp default current_timestamp,
   updated_at       timestamp default current_timestamp
);

-- Transfers table
create table transfers (
   id             uuid primary key default gen_random_uuid(),
   user_id        uuid
      references users ( id )
         on delete cascade,
   from_wallet_id uuid
      references wallets ( id )
         on delete cascade,
   to_wallet_id   uuid
      references wallets ( id )
         on delete cascade,
   amount         decimal(15,2) not null check ( amount > 0 ),
   note           text,
   transfer_date  timestamp default current_timestamp,
   created_at     timestamp default current_timestamp,
   check ( from_wallet_id != to_wallet_id )
);

-- ================================================
-- INDEXES
-- ================================================

-- User-related queries
create index idx_wallets_user_id on
   wallets (
      user_id
   );
create index idx_transactions_user_id on
   transactions (
      user_id
   );
create index idx_transactions_wallet_id on
   transactions (
      wallet_id
   );
create index idx_categories_user_id on
   categories (
      user_id
   );
create index idx_transfers_user_id on
   transfers (
      user_id
   );

-- Time-based queries
create index idx_transactions_date on
   transactions (
      transaction_date
   );
create index idx_transactions_type on
   transactions (
      type
   );
create index idx_transfers_date on
   transfers (
      transfer_date
   );

-- ================================================
-- SEED DATA
-- ================================================

-- Insert wallet types
insert into wallet_types (
   id,
   name,
   icon,
   description
) values ( 'cash',
           'Tiền mặt',
           '💵',
           'Tiền mặt cầm tay' ),( 'bank',
                                  'Tài khoản ngân hàng',
                                  '🏦',
                                  'Tài khoản ngân hàng thông thường' ),( 'credit',
                                                                         'Thẻ tín dụng',
                                                                         '💳',
                                                                         'Thẻ tín dụng và thẻ ghi nợ' ),( 'savings',
                                                                                                          'Tài khoản tiết kiệm'
                                                                                                          ,
                                                                                                          '💰',
                                                                                                          'Tài khoản tiết kiệm có lãi suất'
                                                                                                          ),( 'ewallet',
                                                                                                                                            'Ví điện tử'
                                                                                                                                            ,
                                                                                                                                            '📱'
                                                                                                                                            ,
                                                                                                                                            'Ví điện tử (MoMo, ZaloPay, ...)'
                                                                                                                                            )
                                                                                                                                            ,
                                                                                                                                            (
                                                                                                                                            'investment'
                                                                                                                                            ,
                                                                                                                                                                              'Tài khoản đầu tư'
                                                                                                                                                                              ,
                                                                                                                                                                              '📈'
                                                                                                                                                                              ,
                                                                                                                                                                              'Tài khoản đầu tư chứng khoán'
                                                                                                                                                                              )
                                                                                                                                                                              ;

-- Insert default categories (with NULL user_id for global defaults)
insert into categories (
   id,
   user_id,
   name,
   icon,
   color,
   is_default
) values ( gen_random_uuid(),
           null,
           'Ăn uống',
           '🍔',
           'orange',
           true ),( gen_random_uuid(),
                    null,
                    'Đi lại',
                    '🚗',
                    'blue',
                    true ),( gen_random_uuid(),
                             null,
                             'Mua sắm',
                             '🛍️',
                             'purple',
                             true ),( gen_random_uuid(),
                                      null,
                                      'Giải trí',
                                      '🎮',
                                      'green',
                                      true ),( gen_random_uuid(),
                                               null,
                                               'Y tế',
                                               '🏥',
                                               'red',
                                               true ),( gen_random_uuid(),
                                                        null,
                                                        'Tiện ích',
                                                        '⚡',
                                                        'yellow',
                                                        true ),( gen_random_uuid(),
                                                                 null,
                                                                 'Giáo dục',
                                                                 '📚',
                                                                 'indigo',
                                                                 true ),( gen_random_uuid(),
                                                                          null,
                                                                          'Du lịch',
                                                                          '✈️',
                                                                          'teal',
                                                                          true ),( gen_random_uuid(),
                                                                                   null,
                                                                                   'Tiết kiệm',
                                                                                   '💰',
                                                                                   'emerald',
                                                                                   true ),( gen_random_uuid(),
                                                                                            null,
                                                                                            'Khác',
                                                                                            '📦',
                                                                                            'gray',
                                                                                            true );

-- ================================================
-- COMMENTS
-- ================================================

comment on table users is
   'User accounts and profile information';
comment on table user_settings is
   'User preferences and settings';
comment on table wallet_types is
   'Reference table for wallet types';
comment on table wallets is
   'User wallets/accounts for storing money';
comment on table categories is
   'Transaction categories (both default and user-created)';
comment on table transactions is
   'Individual income/expense transactions';
comment on table transfers is
   'Money transfers between wallets';