from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import scraper

models.Base.metadata.create_all(bind=engine)

def populate():
    db = SessionLocal()
    
    all_products = []
    print("Scraping Steve's Leaves...")
    all_products.extend(scraper.scrape_steves_leaves())
    print("Scraping Cactus Art...")
    all_products.extend(scraper.scrape_cactus_art())
    print("Scraping Llifle...")
    all_products.extend(scraper.scrape_llifle())
    
    print(f"Total scraped items: {len(all_products)}")
    
    for p_data in all_products:
        # Check if exists by name
        existing = db.query(models.Product).filter(models.Product.name == p_data['name']).first()
        if not existing:
            print(f"Adding {p_data['name']}")
            db_product = models.Product(**p_data)
            db.add(db_product)
        else:
            print(f"Skipping duplicate: {p_data['name']}")
            # Optional: update description or other fields if better source
            
    db.commit()
    db.close()

if __name__ == "__main__":
    populate()
