# Smart Farm E-Commerce

## Setup

### Backend
1. Navigate to `backend` directory.
2. Create a virtual environment: `python3 -m venv venv`
3. Activate it: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Set up your database. The project uses SQLite by default, so no extra setup is needed.
   - Default: `sqlite:///./smartfarm.db`
6. Run the server: `uvicorn main:app --reload`

### Frontend
1. Navigate to `frontend` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Scraper
To populate the database with products from Steve's Leaves, Cactus Art, and Llifle:
1. Ensure the backend is configured and database is running.
2. Run: `python populate_db.py` inside the `backend` directory.

## Features
- **Storefront**: Browse products, view details, add to cart.
- **Admin UI**: Manage inventory (Add/Edit/Delete products).
- **Scraper**: Automated product catalog population.
