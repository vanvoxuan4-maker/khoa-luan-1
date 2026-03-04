# app/main.py
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import text
from app.db.session import engine
from app.db.base import Base
from app.db.base_class import Base
# Import router
from app.api.endpoints import products, auth, cart, orders, marketing, admin, dashboard, chat_admin, users, audit
from app.api.endpoints import payment
from app.api.endpoints import vnpay


def init_db_structure():
    try:
        with engine.connect() as conn:
            sql_path = "app/init_db.sql" 
            if os.path.exists(sql_path):
                with open(sql_path, "r", encoding="utf-8") as f:
                    conn.execute(text(f.read()))
                conn.commit()
    except Exception as e:
        print(f"💡 DB Info: {e}")

init_db_structure()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bike Shop API - Final Version")

# 👇 FIX LỖI CORS QUAN TRỌNG
# Không được dùng ["*"] khi allow_credentials=True
# app/main.py
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization", "Content-Type", "Accept"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Kết nối Router
app.include_router(auth.router, tags=["Tài khoản"]) # URL sẽ là /register, /login
app.include_router(products.router, tags=["Quản lý Sản phẩm"])
app.include_router(cart.router, prefix="/cart", tags=["Quản lý Giỏ hàng"])
app.include_router(orders.router, prefix="/orders", tags=["Quản lý Đơn hàng"])
app.include_router(marketing.router, tags=["Admin - Marketing"])
app.include_router(admin.router, prefix="/admin", tags=["Admin - General"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard - Thống kê"])
app.include_router(chat_admin.router, tags=["Admin - Chat AI"])
app.include_router(payment.router, prefix="/payment", tags=["Thanh toán"])
app.include_router(vnpay.router, prefix="/vnpay", tags=["VNPay"])
# Thêm router Users mới
app.include_router(users.router, prefix="/users", tags=["Quản lý User"])
# Thêm router Audit
app.include_router(audit.router, prefix="/audit", tags=["Audit Log"])


@app.get("/")
def read_root():
    return {"message": "Server Bike Shop Ready! 🚀"}