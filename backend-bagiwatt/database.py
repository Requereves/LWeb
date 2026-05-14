from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL koneksi ke MySQL lokal lu
# Format: mysql+driver://user:password@host/nama_database
# Karena di XAMPP/Laragon default usernya 'root' dan passwordnya kosong, formatnya gini:
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:@localhost/db_bagiwatt"

# Bikin mesin penggerak koneksinya
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Bikin pabrik sesi (Session) buat buka jalur obrolan ke database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Cetakan dasar (Base) buat ngenalin tabel-tabel MySQL ke Python nantinya
Base = declarative_base()

# Fungsi pembantu biar tiap kali frontend nembak API, 
# Python otomatis bukain koneksi database dan langsung ditutup lagi kalau udah kelar (biar gak lemot/bocor)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()