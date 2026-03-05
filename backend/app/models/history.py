from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.base_class import Base

class LichSuDonHang(Base):
    __tablename__ = "lichsu_donhang"
    
    ma_lichsu = Column(Integer, primary_key=True, index=True)
    ma_don_hang = Column(Integer, ForeignKey("donhang.ma_don_hang"), nullable=False, index=True)
    trang_thai = Column(String(50), nullable=False)
    mo_ta = Column(Text, nullable=True)
    thoi_gian = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<LichSuDonHang {self.ma_lichsu}: {self.trang_thai} for Order #{self.ma_don_hang}>"
