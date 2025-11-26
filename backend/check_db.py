from database import SessionLocal
from models import Product

db = SessionLocal()
products = db.query(Product).all()
print(f'Total products: {len(products)}')
print("\nFirst 10 products:")
for p in products[:10]:
    print(f'{p.id}. {p.name} - ${p.price} - {p.category} - Stock: {p.stock}')
    if p.image_url:
        print(f'   Image: {p.image_url[:50]}...')
db.close()
