from database import SessionLocal
from models import Product

db = SessionLocal()
products = db.query(Product).filter(Product.category == "Tropical").all()
print(f'Tropical products (Steve\'s Leaves): {len(products)}')
for p in products[:10]:
    print(f'{p.id}. {p.name} - ${p.price} - Stock: {p.stock}')
    if p.image_url:
        print(f'   Image: {p.image_url[:80]}')
    print(f'   Description: {p.description}')
    print()
db.close()
