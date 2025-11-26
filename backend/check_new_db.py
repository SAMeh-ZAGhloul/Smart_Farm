from database import SessionLocal
from models import Product

db = SessionLocal()
products = db.query(Product).all()
print(f'Total products: {len(products)}')
print("\nFirst 5 products with details:")
for p in products[:5]:
    print(f'\n{p.product_id}: {p.name}')
    print(f'  Category: {p.category} / {p.sub_category}')
    print(f'  Species: {p.species_botanical_name}')
    print(f'  Price: ${p.price}')
    print(f'  Stock: {p.stock}')
    print(f'  Image: {p.image_path}')
    print(f'  Description: {p.description[:80]}...' if p.description else '  Description: None')
db.close()
