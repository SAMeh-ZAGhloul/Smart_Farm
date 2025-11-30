from pydantic import BaseModel
from typing import Optional, List

class ProductBase(BaseModel):
    product_id: Optional[str] = None
    name: str
    category: Optional[str] = None
    sub_category: Optional[str] = None
    species_botanical_name: Optional[str] = None
    family: Optional[str] = None
    variety_cultivar: Optional[str] = None
    description: Optional[str] = None
    instruction_notes: Optional[str] = None
    price: float
    image_path: Optional[str] = None
    stock: int = 0
    source_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class OrderItem(BaseModel):
    product_id: int
    quantity: int
    price: float
    name: str

class OrderCreate(BaseModel):
    email: str
    name: str
    address: str
    city: str
    zip: str
    items: List[OrderItem]
    total: float
