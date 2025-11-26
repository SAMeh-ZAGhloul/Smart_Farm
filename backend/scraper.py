import requests
from bs4 import BeautifulSoup
import re
import os
from pathlib import Path
from urllib.parse import urljoin
import time

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
}

# Create images directory
IMAGES_DIR = Path(__file__).parent / "images"
IMAGES_DIR.mkdir(exist_ok=True)

def download_image(url, product_id):
    """Download image and save it locally with product ID"""
    if not url:
        return None
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            # Get file extension from URL or default to jpg
            ext = url.split('.')[-1].split('?')[0]
            if ext not in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                ext = 'jpg'
            
            filename = f"{product_id}.{ext}"
            filepath = IMAGES_DIR / filename
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            return f"images/{filename}"
    except Exception as e:
        print(f"Error downloading image {url}: {e}")
    
    return None

def clean_price(text):
    if not text:
        return 0.0
    match = re.search(r'\$\s*(\d+\.?\d*)', text)
    if match:
        return float(match.group(1))
    return 0.0

def scrape_steves_leaves():
    url = "https://stevesleaves.com/collections/all"
    products = []
    print(f"Scraping {url}...")
    
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            cards = soup.find_all('div', class_='product-item')
            print(f"Found {len(cards)} cards on Steve's Leaves")
            
            for idx, card in enumerate(cards[:30], start=1):
                try:
                    # Extract product link to get more details
                    link = card.find('a', class_='product-item__title')
                    if not link:
                        links = card.find_all('a')
                        for l in links:
                            if l.get_text(strip=True):
                                link = l
                                break
                    
                    name = link.get_text(strip=True) if link else "Unknown Plant"
                    if "Quick View" in name:
                        name = name.replace("Quick View", "").strip()
                    
                    # Generate product ID
                    product_id = f"PL-{1000 + idx}"
                    
                    # Price
                    price_tag = card.find(class_='price')
                    price_text = price_tag.get_text(strip=True) if price_tag else card.get_text()
                    price = clean_price(price_text)
                    if price == 0.0:
                        price = 19.99
                    
                    # Image - download locally
                    img_tag = card.find('img')
                    image_path = None
                    if img_tag:
                        src = img_tag.get('src') or img_tag.get('data-src')
                        if src:
                            if src.startswith('//'):
                                src = "https:" + src
                            elif src.startswith('/'):
                                src = "https://stevesleaves.com" + src
                            
                            # Download image
                            image_path = download_image(src, product_id)
                    
                    # Stock
                    stock = 0 if "Sold out" in card.get_text() else 10
                    
                    # Extract botanical name from product name if possible
                    # Many plant names follow pattern: Genus species 'Cultivar'
                    species = name
                    variety = ""
                    if "'" in name or '"' in name:
                        parts = re.split(r"['\"]", name)
                        if len(parts) >= 2:
                            species = parts[0].strip()
                            variety = parts[1].strip()
                    
                    # Try to get more details from product page
                    description = f"Beautiful {name} from Steve's Leaves. A rare and sought-after tropical plant perfect for indoor growing."
                    instruction_notes = """Care Instructions:
- Light: Bright, indirect light
- Temperature: 65-75°F (18-24°C)
- Humidity: 60% or higher
- Watering: Keep soil evenly moist but not waterlogged
- Soil: Well-draining potting mix"""

                    if name and name != "Unknown Plant":
                        products.append({
                            "product_id": product_id,
                            "name": name,
                            "category": "Indoor Plant",
                            "sub_category": "Tropical",
                            "species_botanical_name": species,
                            "family": "Araceae",  # Most are Araceae
                            "variety_cultivar": variety,
                            "description": description,
                            "instruction_notes": instruction_notes,
                            "price": price,
                            "image_path": image_path,
                            "stock": stock,
                            "source_url": "https://stevesleaves.com"
                        })
                        
                        print(f"Added: {product_id} - {name}")
                        time.sleep(0.5)  # Be nice to the server
                        
                except Exception as e:
                    print(f"Error parsing card: {e}")
                    
    except Exception as e:
        print(f"Error scraping Steve's Leaves: {e}")
    
    return products

def scrape_cactus_art():
    """Scrape cactus species from Cactus Art"""
    url = "https://www.cactus-art.biz/gallery/Photo_gallery_abc_cactus.htm"
    products = []
    print(f"Scraping {url}...")
    
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            links = soup.find_all('a')
            print(f"Found {len(links)} links on Cactus Art")
            
            count = 0
            for link in links:
                if count >= 15:
                    break
                
                href = link.get('href')
                text = link.get_text(strip=True)
                
                if href and len(text) > 5:
                    product_id = f"CA-{2000 + count}"
                    
                    img = link.find('img')
                    image_path = None
                    if img:
                        src = img.get('src')
                        if src:
                            full_url = urljoin(url, src)
                            image_path = download_image(full_url, product_id)
                    
                    description = f"{text} - A unique cactus species from Cactus Art's collection."
                    instruction_notes = """Care Instructions:
- Light: Full sun to bright light
- Temperature: 60-85°F (15-29°C)
- Humidity: Low, 30-40%
- Watering: Water sparingly, allow soil to dry completely between waterings
- Soil: Well-draining cactus mix"""

                    products.append({
                        "product_id": product_id,
                        "name": text,
                        "category": "Succulent",
                        "sub_category": "Cactus",
                        "species_botanical_name": text,
                        "family": "Cactaceae",
                        "variety_cultivar": "",
                        "description": description,
                        "instruction_notes": instruction_notes,
                        "price": 15.0,
                        "image_path": image_path,
                        "stock": 5,
                        "source_url": "https://www.cactus-art.biz"
                    })
                    count += 1
                    print(f"Added: {product_id} - {text}")
                    time.sleep(0.5)
                    
    except Exception as e:
        print(f"Error scraping Cactus Art: {e}")
    
    return products

def scrape_llifle():
    """Scrape from Llifle Encyclopedia"""
    url = "https://www.llifle.com/Encyclopedia/CACTI/"
    products = []
    print(f"Scraping {url}...")
    
    try:
        response = requests.get(url, headers=HEADERS)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            main_body = soup.find('div', id='main_body')
            
            if main_body:
                links = main_body.find_all('a')[:15]
                print(f"Found {len(links)} links in Llifle")
                
                for idx, link in enumerate(links):
                    text = link.get_text(strip=True)
                    if len(text) > 3 and "Home" not in text:
                        product_id = f"LL-{3000 + idx}"
                        
                        description = f"{text} - Encyclopedia entry from Llifle, comprehensive plant database."
                        instruction_notes = """Care Instructions:
- Light: Varies by species, generally bright light
- Temperature: 50-80°F (10-27°C)
- Humidity: Low to moderate
- Watering: Allow soil to dry between waterings
- Soil: Well-draining succulent mix"""

                        products.append({
                            "product_id": product_id,
                            "name": text,
                            "category": "Succulent",
                            "sub_category": "Cactus",
                            "species_botanical_name": text,
                            "family": "Cactaceae",
                            "variety_cultivar": "",
                            "description": description,
                            "instruction_notes": instruction_notes,
                            "price": 25.0,
                            "image_path": None,
                            "stock": 8,
                            "source_url": "https://www.llifle.com"
                        })
                        print(f"Added: {product_id} - {text}")
                        
    except Exception as e:
        print(f"Error scraping Llifle: {e}")
    
    return products

if __name__ == "__main__":
    print("Starting scraper...")
    p1 = scrape_steves_leaves()
    print(f"\nSteve's Leaves: {len(p1)} products")
    
    p2 = scrape_cactus_art()
    print(f"Cactus Art: {len(p2)} products")
    
    p3 = scrape_llifle()
    print(f"Llifle: {len(p3)} products")
    
    print(f"\nTotal products: {len(p1) + len(p2) + len(p3)}")
