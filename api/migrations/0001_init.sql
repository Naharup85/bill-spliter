CREATE TABLE homes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
    member_order INTEGER PRIMARY KEY AUTOINCREMENT,
    id TEXT NOT NULL UNIQUE,
    home_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_members_home
        FOREIGN KEY (home_id)
        REFERENCES homes(id)
        ON DELETE CASCADE
    
    CONSTRAINT uq_home_member_name
        UNIQUE (home_id, name)
);

CREATE TABLE bills (
    id TEXT PRIMARY KEY,
    home_id TEXT NOT NULL,
    title TEXT NOT NULL,
    total_cents INTEGER NOT NULL,

    CONSTRAINT chk_bill_total_positive
        CHECK (total_cents > 0),

    CONSTRAINT fk_bills_home
        FOREIGN KEY (home_id)
        REFERENCES homes(id)
        ON DELETE CASCADE
);

CREATE TABLE shares (
    id TEXT PRIMARY KEY,
    bill_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    paid_at TEXT,
    idempotency_key TEXT,

    CONSTRAINT chk_share_amount_nonnegative
        CHECK (amount_cents >= 0),

    CONSTRAINT fk_shares_bill
        FOREIGN KEY (bill_id)
        REFERENCES bills(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_shares_member
        FOREIGN KEY (member_id)
        REFERENCES members(id),

    CONSTRAINT uq_bill_member_share
        UNIQUE (bill_id, member_id)
);