# app/main.py
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.sql import text
from app.db.session import engine
from app.db.base import Base
# Import router
from app.api.endpoints import products, auth, cart, orders, marketing, admin, dashboard, chat_admin, users, audit
from app.api.endpoints import payment
from app.api.endpoints import vnpay
from app.utils.image_hooks import init_image_hooks
import subprocess
import asyncio


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
init_image_hooks() # Kích hoạt tự động xóa ảnh khi record thay đổi

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

# --- BACKGROUND TASK: DỌN DẸP ẢNH RÁC MỖI 24 GIỜ ---
async def periodic_image_cleanup_loop():
    # Đợi 10 giây sau khi startup để server ổn định rồi mới chạy lần đầu
    await asyncio.sleep(10)
    while True:
        try:
            print("INFO: Bat dau don dep anh rac dinh ky (Background Task)...")
            import sys
            cleanup_script = os.path.join("app", "utils", "cleanup_images.py")
            if os.path.exists(cleanup_script):
                # Chạy script cleanup_images.py với tham số --delete
                subprocess.run([sys.executable, cleanup_script, "--delete"], input="y\n", text=True)
                print("DONE: Don dep anh rac dinh ky hoan tat.")
        except Exception as e:
            print(f"ERROR: Loi khi chay background cleanup: {e}")
        
        await asyncio.sleep(60 * 60 * 24)  # Chạy lại sau mỗi 24 giờ

@app.on_event("startup")
async def startup_event():
    # Khởi tạo background task
    asyncio.create_task(periodic_image_cleanup_loop())

@app.get("/")
def read_root():
    return {"message": "Server Bike Shop Ready! 🚀"}