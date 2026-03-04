-- Migration script for audit_logs table
-- Run this script to create the audit_logs table

CREATE TABLE IF NOT EXISTS audit_logs (
    ma_log SERIAL PRIMARY KEY,
    ma_nguoidung INTEGER NOT NULL REFERENCES users(ma_nguoidung) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    description TEXT NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(ma_nguoidung);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);

-- Add comment to table
COMMENT ON TABLE audit_logs IS 'Audit log table to track admin activities';
COMMENT ON COLUMN audit_logs.ma_log IS 'Primary key';
COMMENT ON COLUMN audit_logs.ma_nguoidung IS 'User ID who performed the action';
COMMENT ON COLUMN audit_logs.action IS 'Action type: login, logout, create, update, delete, view';
COMMENT ON COLUMN audit_logs.resource_type IS 'Resource type: product, order, user, category, brand, voucher';
COMMENT ON COLUMN audit_logs.resource_id IS 'ID of the affected resource';
COMMENT ON COLUMN audit_logs.description IS 'Description of the action';
COMMENT ON COLUMN audit_logs.details IS 'Additional details in JSON format';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the user';
COMMENT ON COLUMN audit_logs.user_agent IS 'User agent string from browser';
COMMENT ON COLUMN audit_logs.timestamp IS 'Timestamp when the action was performed';
