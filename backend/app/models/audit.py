# app/models/audit.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.db.base_class import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    ma_log = Column(Integer, primary_key=True, index=True)
    ma_nguoidung = Column(Integer, ForeignKey("users.ma_user"), nullable=False, index=True)
    action = Column(String(50), nullable=False, index=True)  # login, logout, create, update, delete, view
    resource_type = Column(String(50), index=True)  # product, order, user, category, brand, voucher
    resource_id = Column(Integer)
    description = Column(Text, nullable=False)
    details = Column(JSON)  # JSON field for additional details
    ip_address = Column(String(45))  # IPv4 or IPv6
    user_agent = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    def __repr__(self):
        return f"<AuditLog {self.ma_log}: {self.action} on {self.resource_type}>"
