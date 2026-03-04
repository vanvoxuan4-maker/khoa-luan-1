# app/schemas/audit.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AuditLogCreate(BaseModel):
    action: str
    resource_type: Optional[str] = None
    resource_id: Optional[int] = None
    description: str
    details: Optional[dict] = None

class AuditLogResponse(BaseModel):
    ma_log: int
    ma_nguoidung: int
    action: str
    resource_type: Optional[str]
    resource_id: Optional[int]
    description: str
    details: Optional[dict]
    ip_address: Optional[str]
    user_agent: Optional[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True

class AuditLogFilter(BaseModel):
    skip: int = 0
    limit: int = 20
    action_filter: Optional[str] = None
    resource_filter: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    user_id: Optional[int] = None
