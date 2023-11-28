CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    campaign_name TEXT,
    start_date DATE,
    start_time TIME,
    status TEXT,
    template_id TEXT,
    FOREIGN KEY (template_id) REFERENCES email_templates(id)
);

CREATE TABLE IF NOT EXISTS recipients (
    recipient_id INTEGER PRIMARY KEY,
    campaign_id INTEGER,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    status TEXT CHECK(status IN ('Subscribed', 'Unsubscribed')) DEFAULT 'Subscribed',
    FOREIGN KEY (campaign_id) REFERENCES campaigns(campaign_id)
);

CREATE TABLE IF NOT EXISTS email_templates (
    id TEXT PRIMARY KEY,
    template_name TEXT,
    subject TEXT,
    body TEXT
);

CREATE TABLE IF NOT EXISTS emails_sent (
    id TEXT PRIMARY KEY,
    email TEXT,
    subject TEXT,
    sent_from TEXT,
    sent_at TEXT,
    read_mail INTEGER DEFAULT 0,
    notification_popped INTEGER DEFAULT 0
);