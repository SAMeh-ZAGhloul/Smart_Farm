# Smart Farm E-Commerce

A full-stack e-commerce application for rare plants, featuring a React frontend, FastAPI backend, and automated web scraping capabilities.

## 🚀 Features

### Storefront
- **Responsive Design**: Beautiful, mobile-friendly UI inspired by premium plant shops.
- **Product Catalog**: Browse rare tropical plants and succulents with rich details.
- **Product Details**: Immersive modal view with high-res images and detailed descriptions.
- **Shopping Cart**: 
  - Persistent cart (saves to local storage).
  - Quantity management and stock validation.
  - Slide-out cart drawer.
- **Checkout Flow**: 
  - Integrated checkout page with shipping and payment forms.
  - Discount code support (Try `SAVE10`!).
  - Automatic shipping calculation.
  - Order confirmation email simulation.

### Admin Dashboard
- **Inventory Management**: Add, edit, and delete products with ease.
- **Auto-Generated IDs**: Smart ID generation based on product categories (e.g., `PL-1001` for plants).
- **Image Management**: 
  - Upload images directly from your computer.
  - **Auto-Find Missing Images**: One-click feature to search and download images from the web for products missing them.
- **Rich Data**: Manage botanical names, families, care instructions, and more.

### Backend & Data
- **FastAPI**: High-performance Python backend.
- **SQLite Database**: Zero-configuration database setup.
- **Web Scraper**: Automated scraping from multiple sources:
  - Steve's Leaves (Tropical plants)
  - Cactus Art (Cacti)
  - Llifle (Encyclopedia entries)
- **Image Handling**: Local image storage and serving.

## 🛠️ Setup Guide

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5174` (or similar).

### 📦 Populating Data
To populate your store with initial products:

1. Make sure you are in the `backend` directory.
2. Run the population script:
   ```bash
   python3 populate_db.py
   ```
   This will:
   - Scrape data from configured websites.
   - Download product images locally.
   - Populate the SQLite database.

### 📸 Managing Images
If you have products without images:
1. Go to the Admin Panel: `http://localhost:5174/admin`
2. Click the **"Auto-Find Missing Images"** button.
3. The system will automatically search DuckDuckGo, download the best matching images, and update your products.

## 🏗️ Project Structure

```
Smart Farm/
├── backend/
│   ├── images/          # Locally stored product images
│   ├── main.py          # FastAPI application & endpoints
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic models
│   ├── crud.py          # Database operations
│   ├── database.py      # Database connection
│   ├── scraper.py       # Web scraping logic
│   ├── image_finder.py  # Image search utility
│   └── populate_db.py   # Data population script
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components (Navbar, ProductCard, ProductDetailModal)
│   │   ├── pages/       # Page components (Home, Admin, Checkout)
│   │   ├── context/     # React Context (CartContext)
│   │   └── api.js       # API client functions
│   └── ...
│
└── README.md
```

