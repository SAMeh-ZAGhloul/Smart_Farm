from sqlalchemy import Column, Integer, String, Float, Text
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String(50), unique=True, index=True)  # e.g., PL-102
    name = Column(String(255), index=True)
    category = Column(String(100))
    sub_category = Column(String(100))
    species_botanical_name = Column(String(255))
    family = Column(String(100))
    variety_cultivar = Column(String(255))
    description = Column(Text)
    instruction_notes = Column(Text)
    price = Column(Float, default=0.0)
    image_path = Column(String(500))  # Local path to image
    stock = Column(Integer, default=0)
    source_url = Column(String(500))

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
