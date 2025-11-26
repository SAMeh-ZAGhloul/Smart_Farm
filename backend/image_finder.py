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
    # 1. Get list of products needing images
    db = SessionLocal()
    try:
        products = db.query(models.Product).filter(
            (models.Product.image_path == None) | 
            (models.Product.image_path == "")
        ).limit(limit).all()
        
        # Store just the data we need so we can close the DB connection
        product_list = []
        for p in products:
            product_list.append({
                "id": p.id,
                "product_id": p.product_id,
                "name": p.name,
                "botanical_name": p.species_botanical_name
            })
            
    finally:
        db.close()

    if not product_list:
        return {"message": "No products found with missing images"}
        
    print(f"Found {len(product_list)} products missing images")
    results = []
    
    # 2. Process each product independently
    for p_data in product_list:
        result_status = "Failed"
        image_path_update = None
        
        try:
            search_query = f"{p_data['name']} plant"
            if p_data['botanical_name']:
                search_query = f"{p_data['botanical_name']} plant"
            
            print(f"Searching for: {search_query}")
            
            # Perform search (No DB lock here)
            with DDGS() as ddgs:
                ddgs_images = list(ddgs.images(
                    search_query,
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
                    local_path = download_image(image_url, p_data['product_id'])
                    
                    if local_path:
                        image_path_update = local_path
                        result_status = "Updated"
                    else:
                        image_path_update = "NO_IMAGE_FOUND"
                        result_status = "Failed to download"
                else:
                    print("No images found")
                    image_path_update = "NO_IMAGE_FOUND"
                    result_status = "No images found"
                    
        except Exception as e:
            print(f"Error processing {p_data['name']}: {e}")
            image_path_update = "NO_IMAGE_FOUND"
            result_status = f"Error: {str(e)}"
        
        # 3. Update DB for this single product
        if image_path_update:
            db_update = SessionLocal()
            try:
                product = db_update.query(models.Product).filter(models.Product.id == p_data['id']).first()
                if product:
                    product.image_path = image_path_update
                    db_update.commit()
            except Exception as e:
                print(f"Database update error: {e}")
            finally:
                db_update.close()
        
        results.append({
            "id": p_data['product_id'],
            "name": p_data['name'],
            "status": result_status
        })
        
        # Sleep to avoid rate limiting
        time.sleep(random.uniform(1, 2))
    
    return results

if __name__ == "__main__":
    find_missing_images()
