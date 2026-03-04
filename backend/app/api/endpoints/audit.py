# app/api/endpoints/audit.py
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime

from app.db.session import get_db
from app.api.deps import get_current_user, check_admin_role
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogCreate, AuditLogResponse

router = APIRouter()

# Helper function to create audit log
def create_audit_log(
    db: Session,
    user_id: int,
    action: str,
    description: str,
    resource_type: Optional[str] = None,
    resource_id: Optional[int] = None,
    details: Optional[dict] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
):
    """Helper function to create an audit log entry"""
    audit_log = AuditLog(
        ma_nguoidung=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        description=description,
        details=details,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)
    return audit_log

@router.get("/my-logs", response_model=List[AuditLogResponse])
def get_my_audit_logs(
    skip: int = 0,
    limit: int = 5,
    action_filter: Optional[str] = None,
    resource_filter: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get audit logs for the current admin user"""
    query = db.query(AuditLog).filter(AuditLog.ma_nguoidung == current_user.ma_user)
    
    # Apply filters
    if action_filter:
        query = query.filter(AuditLog.action == action_filter)
    
    if resource_filter:
        query = query.filter(AuditLog.resource_type == resource_filter)
    
    if date_from:
        try:
            date_from_dt = datetime.fromisoformat(date_from)
            query = query.filter(AuditLog.timestamp >= date_from_dt)
        except ValueError:
            pass
    
    if date_to:
        try:
            # Set to end of day to be inclusive
            date_to_dt = datetime.fromisoformat(date_to).replace(hour=23, minute=59, second=59, microsecond=999999)
            query = query.filter(AuditLog.timestamp <= date_to_dt)
        except ValueError:
            pass
    
    # Order by timestamp descending (newest first)
    query = query.order_by(AuditLog.timestamp.desc())
    
    # Pagination
    logs = query.offset(skip).limit(limit).all()
    return logs

@router.get("/all-logs", response_model=List[AuditLogResponse])
def get_all_audit_logs(
    skip: int = 0,
    limit: int = 5,
    user_id: Optional[int] = None,
    action_filter: Optional[str] = None,
    resource_filter: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_role)
):
    """Get all audit logs (admin only)"""
    query = db.query(AuditLog)
    
    # Apply filters
    if user_id:
        query = query.filter(AuditLog.ma_nguoidung == user_id)
    
    if action_filter:
        query = query.filter(AuditLog.action == action_filter)
    
    if resource_filter:
        query = query.filter(AuditLog.resource_type == resource_filter)
    
    if date_from:
        try:
            date_from_dt = datetime.fromisoformat(date_from)
            query = query.filter(AuditLog.timestamp >= date_from_dt)
        except ValueError:
            pass
    
    if date_to:
        try:
            # Set to end of day to be inclusive
            date_to_dt = datetime.fromisoformat(date_to).replace(hour=23, minute=59, second=59, microsecond=999999)
            query = query.filter(AuditLog.timestamp <= date_to_dt)
        except ValueError:
            pass
    
    # Order by timestamp descending
    query = query.order_by(AuditLog.timestamp.desc())
    
    # Pagination
    logs = query.offset(skip).limit(limit).all()
    return logs

@router.post("/log", response_model=AuditLogResponse)
def create_log(
    log_data: AuditLogCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new audit log entry"""
    # Get IP address from request
    ip_address = request.client.host if request.client else None
    
    # Get user agent from request headers
    user_agent = request.headers.get("user-agent")
    
    log = create_audit_log(
        db=db,
        user_id=current_user.ma_user,
        action=log_data.action,
        description=log_data.description,
        resource_type=log_data.resource_type,
        resource_id=log_data.resource_id,
        details=log_data.details,
        ip_address=ip_address,
        user_agent=user_agent
    )
    
    return log

@router.get("/stats")
def get_audit_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_role)
):
    """Get audit log statistics"""
    from sqlalchemy import func
    
    total_logs = db.query(func.count(AuditLog.ma_log)).scalar()
    
    # Count by action
    action_counts = db.query(
        AuditLog.action,
        func.count(AuditLog.ma_log)
    ).group_by(AuditLog.action).all()
    
    # Count by resource type
    resource_counts = db.query(
        AuditLog.resource_type,
        func.count(AuditLog.ma_log)
    ).group_by(AuditLog.resource_type).all()
    
    return {
        "total_logs": total_logs,
        "by_action": {action: count for action, count in action_counts},
        "by_resource": {resource: count for resource, count in resource_counts if resource}
    }

@router.delete("/logs/clear")
def clear_my_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_role)
):
    """Xóa tất cả audit logs của admin hiện tại"""
    deleted = db.query(AuditLog).filter(
        AuditLog.ma_nguoidung == current_user.ma_user
    ).delete(synchronize_session=False)
    db.commit()
    return {"message": f"Đã xóa {deleted} bản ghi hoạt động", "deleted_count": deleted}

@router.delete("/logs/{log_id}")
def delete_audit_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(check_admin_role)
):
    """Xóa một audit log theo ID (chỉ được xóa log của chính mình)"""
    log = db.query(AuditLog).filter(
        AuditLog.ma_log == log_id,
        AuditLog.ma_nguoidung == current_user.ma_user
    ).first()

    if not log:
        raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi hoặc bạn không có quyền xóa")

    db.delete(log)
    db.commit()
    return {"message": "Đã xóa bản ghi hoạt động"}
