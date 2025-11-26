from duckduckgo_search import DDGS
import requests
from pathlib import Path
import time
import random
from sqlalchemy.orm import Session
import models
from database import SessionLocal

# Setup images directory
IMAGES_DIR = Path(__file__).parent / "images"
IMAGES_DIR.mkdir(exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
}

def download_image(url, product_id):
    """Download image and save it locally with product ID"""
    if not url:
        return None
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            # Get file extension from URL or default to jpg
            ext = url.split('.')[-1].split('?')[0]
            if ext.lower() not in ['jpg', 'jpeg', 'png', 'webp']:
                ext = 'jpg'
            
            filename = f"{product_id}.{ext}"
            filepath = IMAGES_DIR / filename
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            return f"images/{filename}"
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
    
    return None

def find_missing_images(limit: int = 5):
    """Find products without images and search for them on the web"""
    db = SessionLocal()
    try:
        # Find products with no image_path
        products = db.query(models.Product).filter(
            (models.Product.image_path == None) | (models.Product.image_path == "")
        ).limit(limit).all()
        
        results = []
        
        if not products:
            return {"message": "No products found with missing images"}
            
        print(f"Found {len(products)} products missing images")
        
        with DDGS() as ddgs:
            for product in products:
                search_query = f"{product.name} plant"
                if product.species_botanical_name:
                    search_query = f"{product.species_botanical_name} plant"
                
                print(f"Searching for: {search_query}")
                
                try:
                    # Search for images
                    keywords = search_query
                    ddgs_images = list(ddgs.images(
                        keywords,
                        region="wt-wt",
                        safesearch="off",
                        size="Medium",
                        type_image="photo",
                        layout="Wide",
                        max_results=1
                    ))
                    
                    if ddgs_images:
                        image_url = ddgs_images[0]['image']
                        print(f"Found image: {image_url}")
                        
                        # Download image
                        local_path = download_image(image_url, product.product_id)
                        
                        if local_path:
                            product.image_path = local_path
                            results.append({
                                "id": product.product_id,
                                "name": product.name,
                                "status": "Updated",
                                "image": local_path
                            })
                        else:
                            results.append({
                                "id": product.product_id,
                                "name": product.name,
                                "status": "Failed to download"
                            })
                    else:
                        print("No images found")
                        results.append({
                            "id": product.product_id,
                            "name": product.name,
                            "status": "No images found"
                        })
                        
                    # Sleep to avoid rate limiting
                    time.sleep(random.uniform(1, 2))
                    
                except Exception as e:
                    print(f"Error processing {product.name}: {e}")
                    results.append({
                        "id": product.product_id,
                        "name": product.name,
                        "status": f"Error: {str(e)}"
                    })
        
        db.commit()
        return results
        
    finally:
        db.close()

if __name__ == "__main__":
    find_missing_images()
