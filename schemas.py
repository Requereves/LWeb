from pydantic import BaseModel
from typing import Optional

class CategoryResponse(BaseModel):
    category_id: int
    category_name: str
    description: str

    class Config:
        from_attributes = True 

# --- TAMBAHAN BARU: Cetakan JSON untuk tangkap input form ---
class DeviceCreate(BaseModel):
    user_id: int = 1  # Default sementara ke user_id 1 (Orang) buat testing
    category_id: int
    device_name: str
    brand: Optional[str] = "Umum" # Kasih nilai fallback kalau form opsional kosong
    manufacture_year: Optional[int] = 2026
    power_watt: float
    is_active: bool = True

# --- TAMBAHAN BARU: Format Output JSON buat nampilin list perangkat ---
class DeviceResponse(BaseModel):
    device_id: int
    user_id: int
    category_id: int
    device_name: str
    brand: str
    manufacture_year: int
    power_watt: float
    is_active: bool

    class Config:
        from_attributes = True

# --- TAMBAHAN BARU: Output JSON untuk halaman Token Listrik ---
class TokenEstimateResponse(BaseModel):
    estimated_days_left: float
    remaining_kwh: float
    avg_daily_kwh: float

    class Config:
        from_attributes = True

# --- TAMBAHAN BARU: Skema untuk Kalkulasi Log Cerdas ---
class LogCalculateRequest(BaseModel):
    device_id: int
    duration_hours: float

class LogCalculateResponse(BaseModel):
    total_kwh: float
    carbon_emission: float

# --- TAMBAHAN BARU: Skema untuk Top 3 Perangkat Terboros ---
class TopDeviceResponse(BaseModel):
    device_id: int
    device_name: str
    brand: str
    power_watt: float
    category_name: str  # Kita kasih nama kategorinya sekalian biar UI gampang nampilinnya

    class Config:
        from_attributes = True

# --- TAMBAHAN BARU: Skema Katalog Perangkat Riil ---
class CatalogDeviceResponse(BaseModel):
    catalog_id: int
    category_id: int
    device_name: str
    brand: str
    power_watt: float

    class Config:
        from_attributes = True