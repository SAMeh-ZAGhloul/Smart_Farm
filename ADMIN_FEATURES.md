# Admin UI Enhancements

## ✅ New Features

### 1. **Auto-Generated Product IDs**

#### How It Works:
- Product IDs are **automatically generated** based on the selected category
- Format: `PREFIX-NUMBER`
- Prefixes:
  - `PL-` for Indoor Plants (starts at PL-1001)
  - `CA-` for Succulents/Cacti (starts at CA-2001)
  - Custom prefix for other categories

#### Behavior:
- **When adding a new product**: ID is auto-generated and shown in a read-only field
- **When changing category**: ID updates automatically to match the new category prefix
- **Sequential numbering**: System finds the highest existing number and increments by 1
- **When editing**: Product ID cannot be changed (read-only)

#### Example:
```
Indoor Plant → PL-1001, PL-1002, PL-1003...
Succulent → CA-2001, CA-2002, CA-2003...
```

### 2. **Image File Upload**

#### Features:
- **"Choose Image" button** opens native file picker
- **Accepts**: All image formats (jpg, png, gif, webp, etc.)
- **Upload process**:
  1. Click "Choose Image" button
  2. Select image from your computer
  3. Image uploads automatically to server
  4. Thumbnail preview appears next to button
  5. Image path is saved with product

#### Technical Details:
- Images saved to `/backend/images/` folder
- Filename format: `upload_YYYYMMDD_HHMMSS.ext`
- Unique timestamp prevents filename conflicts
- Image path automatically populated in form
- Preview shows uploaded image immediately

#### UI Elements:
- **Choose Image button**: Opens file picker
- **Image preview**: 60x60px thumbnail next to button
- **Image path**: Shown below button in small text
- **Upload status**: Button shows "Uploading..." during upload

### 3. **Enhanced Product Form**

#### Improvements:
- **Category dropdown**: Select from predefined categories
  - Indoor Plant
  - Succulent
  - Outdoor Plant
  - Herb
- **Auto-fill defaults**:
  - Category: "Indoor Plant"
  - Sub-Category: "Tropical"
  - Family: "Araceae"
- **Visual feedback**:
  - Product ID field grayed out when auto-generated
  - Helper text explains auto-generation
  - Image preview for uploaded files

### 4. **Enhanced Product Table**

#### New Columns:
- **Image column**: Shows 40x40px thumbnail of product image
- **Product ID column**: Shows generated ID (e.g., PL-1001)

#### Features:
- Thumbnails load from server
- Quick visual identification of products
- Compact display fits more information

## Usage Guide

### Adding a New Product:

1. **Product ID**: Auto-generated (e.g., PL-1031)
2. **Name**: Enter product name (required)
3. **Category**: Select from dropdown
   - Changing category updates Product ID prefix
4. **Upload Image**:
   - Click "Choose Image"
   - Select image file
   - Wait for "Image uploaded successfully!" alert
   - See preview appear
5. **Fill other fields**: Species, family, description, etc.
6. **Price & Stock**: Enter values (required)
7. **Click "Add"**: Product is created

### Editing a Product:

1. Click **"Edit"** on any product in table
2. Form fills with product data
3. **Product ID is locked** (cannot change)
4. Modify any other fields
5. Upload new image if needed
6. Click **"Update"** to save changes

### Image Management:

- **Upload new image**: Click "Choose Image" anytime
- **Replace image**: Upload a new file (overwrites image_path)
- **Preview**: Always visible when image is set
- **Remove image**: Clear the image_path field manually

## API Endpoints

### Get Next Product ID
```
GET /next-product-id?category=PL
Response: { "product_id": "PL-1032" }
```

### Upload Image
```
POST /upload-image
Body: FormData with 'file' field
Response: { "image_path": "images/upload_20241126_112230.jpg" }
```

## Technical Implementation

### Backend (`main.py`):
- `get_next_product_id()`: Queries database for highest ID in category
- `upload_image()`: Saves file with unique timestamp
- File validation and error handling

### Frontend (`Admin.jsx`):
- `generateProductId()`: Fetches next ID on load and category change
- `handleFileSelect()`: Uploads file and updates form
- `useRef` for hidden file input
- Image preview with thumbnail

### Benefits:
- ✅ No manual ID entry (prevents duplicates)
- ✅ Easy image upload (no need to type paths)
- ✅ Visual feedback (thumbnails and previews)
- ✅ Automatic organization (category-based IDs)
- ✅ User-friendly (native file picker)

---

**Status**: Admin UI fully enhanced with auto-generation and file upload! 🎨✨
