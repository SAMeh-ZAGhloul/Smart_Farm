from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import SessionLocal, engine, get_db
from pathlib import Path
import shutil
from datetime import datetime

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Mount images directory
images_path = Path(__file__).parent / "images"
images_path.mkdir(exist_ok=True)
app.mount("/images", StaticFiles(directory=str(images_path)), name="images")

# CORS configuration
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:5174", # Vite alternate port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/products", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit)
    return products

@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.update_product(db=db, product_id=product_id, product=product)

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    return crud.delete_product(db=db, product_id=product_id)

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image and return the path"""
    try:
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = Path(file.filename).suffix
        filename = f"upload_{timestamp}{file_extension}"
        filepath = images_path / filename
        
        # Save file
        with filepath.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return {"image_path": f"images/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/next-product-id")
def get_next_product_id(category: str = "PL", db: Session = Depends(get_db)):
    """Generate next product ID based on category"""
    # Get the highest ID for this category prefix
    products = db.query(models.Product).filter(
        models.Product.product_id.like(f"{category}-%")
    ).all()
    
    if not products:
        # First product in this category
        if category == "PL":
            return {"product_id": "PL-1001"}
        elif category == "CA":
            return {"product_id": "CA-2001"}
        elif category == "LL":
            return {"product_id": "LL-3001"}
        else:
            return {"product_id": f"{category}-1001"}
    
    # Extract numbers and find max
    max_num = 0
    for p in products:
        try:
            num = int(p.product_id.split('-')[1])
            if num > max_num:
                max_num = num
        except:
            continue
    
    return {"product_id": f"{category}-{max_num + 1}"}

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Farm API"}
