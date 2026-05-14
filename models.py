# Nah, Date-nya udah ditaruh di ujung kanan sini ya bro:
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, ForeignKey, Date
from database import Base

# --- Cetakan minimalis tabel users ---
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)


# --- Struktur tabel master category ---
class Category(Base):
    __tablename__ = "category"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(255))
    description = Column(Text)


# --- Struktur utama tabel device ---
class Device(Base):
    __tablename__ = "device"

    device_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    category_id = Column(Integer, ForeignKey("category.category_id"))
    device_name = Column(String(255))
    brand = Column(String(255))
    manufacture_year = Column(Integer)
    power_watt = Column(Float)
    is_active = Column(Boolean, default=True)


# --- Struktur tabel token_pool ---
class TokenPool(Base):
    __tablename__ = "token_pool"

    token_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    amount_rupiah = Column(Float)
    kwh_obtained = Column(Float)
    purchase_date = Column(Date) # Sekarang Python udah kenal Date


# --- Struktur tabel usage_log ---
class UsageLog(Base):
    __tablename__ = "usage_log"

    log_id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("device.device_id"))
    usage_date = Column(Date) # Ini juga udah aman
    duration_hours = Column(Float)
    total_kwh = Column(Float)
    carbon_emission = Column(Float)