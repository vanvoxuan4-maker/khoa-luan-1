import os
import sys
import time
from sqlalchemy import text
import argparse

# Thêm thư mục gốc vào PYTHONPATH để có thể import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from app.db.session import engine

# Danh sách từ khóa loại trừ (KHÔNG XÓA các file có chứa từ này)
EXCLUDE_KEYWORDS = ["banner", "logo", "spotlight", "default", "icon"]

def cleanup_orphaned_images(delete=False, min_age_hours=24):
    image_dir = os.path.join("static", "images")
    
    if not os.path.exists(image_dir):
        print(f"ERROR: Thu muc {image_dir} khong ton tai.")
        return

    print(f"INFO: Dang ket noi Database: {engine.url.render_as_string(hide_password=True)}")
    print("INFO: Dang thu thap danh sach anh tu Database (Raw SQL)...")
    
    used_images = set()
    
    try:
        with engine.connect() as connection:
            # 1. Tu bang hinh anh phu
            try:
                result = connection.execute(text("SELECT image_url FROM hinhanh"))
                for row in result:
                    if row[0]:
                        used_images.add(os.path.basename(row[0]))
            except Exception as e:
                print(f"WARNING: Loi doc bang hinhanh: {e}")

            # 2. Tu bang danh muc
            try:
                result = connection.execute(text("SELECT hinh_anh FROM danhmuc"))
                for row in result:
                    if row[0]:
                        used_images.add(os.path.basename(row[0]))
            except Exception as e:
                print(f"WARNING: Loi doc bang danhmuc: {e}")

            # 3. Tu bang thuong hieu
            try:
                result = connection.execute(text("SELECT logo FROM thuonghieu"))
                for row in result:
                    if row[0]:
                        used_images.add(os.path.basename(row[0]))
            except Exception as e:
                print(f"WARNING: Loi doc bang thuonghieu: {e}")
    except Exception as e:
        print(f"ERROR: Loi ket noi Database: {e}")
        print("CRITICAL: Hay chac chan ban da bat Docker hoac Database tuong ung!")
        return

    print(f"DONE: Tim thay {len(used_images)} anh dang duoc su dung trong Database.")
    print(f"INFO: Dang quet thu muc {image_dir}...")

    try:
        all_files = os.listdir(image_dir)
    except Exception as e:
        print(f"ERROR: Loi doc thu muc anh: {e}")
        return

    orphaned_files = []
    excluded_files = []
    skipped_new_files = []
    
    now = time.time()
    min_age_seconds = min_age_hours * 3600

    for filename in all_files:
        filepath = os.path.join(image_dir, filename)
        
        # Bo qua neu la thu muc
        if os.path.isdir(filepath):
            continue
            
        # Kiem tra neu la file rac (khong co trong DB)
        if filename not in used_images:
            # Kiem tra xem co nam trong danh sach loai tru khong
            is_excluded = any(kw.lower() in filename.lower() for kw in EXCLUDE_KEYWORDS)
            
            if is_excluded:
                excluded_files.append(filename)
            else:
                # KIEM TRA THOI GIAN TAO (Safety Buffer)
                file_age = now - os.path.getmtime(filepath)
                if file_age < min_age_seconds:
                    skipped_new_files.append(filename)
                else:
                    orphaned_files.append(filename)

    print("-" * 50)
    print(f"BAO CAO TONG KET:")
    print(f"   - Tong so file: {len(all_files)}")
    print(f"   - File dang dung: {len(all_files) - len(orphaned_files) - len(excluded_files) - len(skipped_new_files)}")
    print(f"   - File loai tru (Bao ve): {len(excluded_files)}")
    print(f"   - File moi (Tam thoi bo qua < {min_age_hours}h): {len(skipped_new_files)}")
    print(f"   - File mo coi (Goi y xoa): {len(orphaned_files)}")
    print("-" * 50)

    if skipped_new_files:
        print(f"\nSAFE: {len(skipped_new_files)} file moi duoc bao ve vi co the dang trong qua trinh tao san pham.")

    if orphaned_files:
        print("\nDELETE: Danh sach file mo coi (Goi y xoa):")
        for f in orphaned_files[:10]:
            print(f"   [ORPHAN] {f}")
        if len(orphaned_files) > 10: print(f"   ... va {len(orphaned_files)-10} file khac.")
        
        if delete:
            confirm = input(f"\nCONFIRM: Ban co CHAC CHAN muon xoa {len(orphaned_files)} file nay khong? (y/n): ")
            if confirm.lower() == 'y':
                count = 0
                for filename in orphaned_files:
                    try:
                        os.remove(os.path.join(image_dir, filename))
                        count += 1
                    except Exception as e:
                        print(f"ERROR: Loi khi xoa {filename}: {e}")
                print(f"\nDONE: Da don dep xong {count} file.")
            else:
                print("\nCANCEL: Da huy lenh xoa.")
        else:
            print("\nWARNING: Ban co the xoa cac file [ORPHAN] tren de tiet kiem dung luong.")
            print(f"INFO: De xoa thuc te, hay chay lenh: python app/utils/cleanup_images.py --delete")
    else:
        print("\nINFO: Khong co anh rac nao duoc tim thay.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Don dep anh mo coi.")
    parser.add_argument("--delete", action="store_true", help="Thuc hien xoa thuc te")
    parser.add_argument("--age", type=int, default=24, help="So gio toi thieu de coi la file cu (default: 24)")
    
    args = parser.parse_args()
    cleanup_orphaned_images(delete=args.delete, min_age_hours=args.age)
