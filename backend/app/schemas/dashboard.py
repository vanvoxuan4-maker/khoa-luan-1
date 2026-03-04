from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

# 1. Thẻ thống kê (4 ô trên cùng)
class StatsCard(BaseModel):
    total_revenue: float
    pending_revenue: float  
    total_orders: int
    total_products: int
    total_users: int

# 2. Dữ liệu biểu đồ
class ChartData(BaseModel):
    date: str
    revenue: float

# 3. Sản phẩm sắp hết hàng (Cái bạn đang thiếu 👇)
class LowStockProduct(BaseModel):
    id: int
    name: str
    stock: int
    image: Optional[str] = None

# 4. Đơn hàng mới nhất
class RecentOrder(BaseModel):
    id: int
    customer_name: str
    total_money: float
    status: str
    created_at: datetime
    address: Optional[str] = "Chưa cập nhật"

# 5. Tổng hợp tất cả (Response trả về cuối cùng)
class DashboardData(BaseModel):
    cards: StatsCard
    chart_data: List[ChartData]
    recent_orders: List[RecentOrder]      # <-- Bổ sung
    low_stock_products: List[LowStockProduct] 
    status_distribution: Dict[str, int]