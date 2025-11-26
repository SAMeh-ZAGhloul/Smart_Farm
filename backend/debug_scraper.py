import requests
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
}

def debug_steves():
    # We have enough info for Steves: div.product-item
    pass

def debug_cactus():
    url = "https://www.cactus-art.biz/"
    print(f"\n--- Debugging {url} ---")
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            # Just print all links that look like products
            links = soup.find_all('a')
            print(f"Found {len(links)} links")
            for link in links[:20]:
                print(f"Link: {link.get_text(strip=True)} -> {link.get('href')}")
    except Exception as e:
        print(f"Error: {e}")

def debug_llifle():
    url = "https://www.llifle.com/Encyclopedia/CACTI/"
    print(f"\n--- Debugging {url} ---")
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            # Print body structure
            print("Body children:")
            for child in soup.body.children:
                if child.name:
                    print(f"Tag: {child.name}, Id: {child.get('id')}, Class: {child.get('class')}")
            
            # Try to find any list of species
            # Maybe look for 'Family', 'Genus'
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_cactus()
    debug_llifle()
