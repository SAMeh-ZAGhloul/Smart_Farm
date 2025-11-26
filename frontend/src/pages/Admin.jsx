import React, { useState, useEffect, useRef } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, uploadImage, getNextProductId, findMissingImages } from '../api';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        product_id: '',
        name: '',
        category: 'Indoor Plant',
        sub_category: 'Tropical',
        species_botanical_name: '',
        family: 'Araceae',
        variety_cultivar: '',
        description: '',
        instruction_notes: '',
        price: '',
        stock: '',
        image_path: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [findingImages, setFindingImages] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadProducts();
        generateProductId();
    }, []);

    const loadProducts = async () => {
        const data = await fetchProducts();
        setProducts(data);
    };

    const handleFindImages = async () => {
        setFindingImages(true);
        let totalProcessed = 0;
        let batchCount = 0;

        try {
            // Process in batches of 5 until no more are found or we hit a safety limit
            while (true) {
                const results = await findMissingImages(5);

                if (results.length === 0 || (results.message && results.message.includes("No products"))) {
                    break;
                }

                totalProcessed += results.length;
                batchCount++;

                // Update UI to show progress (optional, but good for UX)
                console.log(`Batch ${batchCount}: Processed ${results.length} images`);

                // Refresh list to show new images immediately
                await loadProducts();

                // Safety break to prevent infinite loops if something goes wrong
                if (batchCount > 20) break;
            }

            if (totalProcessed > 0) {
                alert(`Success! Found and downloaded ${totalProcessed} new images.`);
            } else {
                alert('No missing images found. All products have images!');
            }

        } catch (error) {
            alert('Error finding images: ' + error.message);
        } finally {
            setFindingImages(false);
        }
    };

    const generateProductId = async () => {
        if (!editingId) {
            const categoryPrefix = newProduct.category === 'Indoor Plant' ? 'PL' :
                newProduct.category === 'Succulent' ? 'CA' : 'PL';
            const data = await getNextProductId(categoryPrefix);
            setNewProduct(prev => ({ ...prev, product_id: data.product_id }));
        }
    };

    const handleCategoryChange = async (category) => {
        setNewProduct(prev => ({ ...prev, category }));
        if (!editingId) {
            const categoryPrefix = category === 'Indoor Plant' ? 'PL' :
                category === 'Succulent' ? 'CA' : 'PL';
            const data = await getNextProductId(categoryPrefix);
            setNewProduct(prev => ({ ...prev, product_id: data.product_id }));
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await uploadImage(file);
            setNewProduct(prev => ({ ...prev, image_path: data.image_path }));
            alert('Image uploaded successfully!');
        } catch (error) {
            alert('Failed to upload image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (product) => {
        setNewProduct(product);
        setEditingId(product.id);
    };

    const handleCancelEdit = async () => {
        setNewProduct({
            product_id: '', name: '', category: 'Indoor Plant', sub_category: 'Tropical',
            species_botanical_name: '', family: 'Araceae', variety_cultivar: '',
            description: '', instruction_notes: '', price: '', stock: '', image_path: ''
        });
        setEditingId(null);
        await generateProductId();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock)
        };

        if (editingId) {
            await updateProduct(editingId, productData);
        } else {
            await createProduct(productData);
        }

        await handleCancelEdit();
        loadProducts();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteProduct(id);
            loadProducts();
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Inventory Management</h1>
                <button
                    onClick={handleFindImages}
                    className="btn btn-secondary"
                    disabled={findingImages}
                >
                    {findingImages ? 'Searching...' : 'Auto-Find Missing Images'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                    <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Product ID *</label>
                            <input
                                value={newProduct.product_id}
                                onChange={e => setNewProduct({ ...newProduct, product_id: e.target.value })}
                                placeholder="e.g., PL-1001"
                                required
                                style={{ backgroundColor: editingId ? 'white' : '#f3f4f6' }}
                                readOnly={!editingId}
                            />
                            <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                {editingId ? 'Cannot change ID when editing' : 'Auto-generated based on category'}
                            </small>
                        </div>
                        <div>
                            <label>Name *</label>
                            <input
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Category *</label>
                                <select
                                    value={newProduct.category}
                                    onChange={e => handleCategoryChange(e.target.value)}
                                    required
                                >
                                    <option value="Indoor Plant">Indoor Plant</option>
                                    <option value="Succulent">Succulent</option>
                                    <option value="Outdoor Plant">Outdoor Plant</option>
                                    <option value="Herb">Herb</option>
                                </select>
                            </div>
                            <div>
                                <label>Sub-Category</label>
                                <input
                                    value={newProduct.sub_category}
                                    onChange={e => setNewProduct({ ...newProduct, sub_category: e.target.value })}
                                    placeholder="e.g., Tropical"
                                />
                            </div>
                        </div>
                        <div>
                            <label>Species / Botanical Name</label>
                            <input
                                value={newProduct.species_botanical_name}
                                onChange={e => setNewProduct({ ...newProduct, species_botanical_name: e.target.value })}
                                placeholder="e.g., Monstera deliciosa"
                            />
                        </div>
                        <div>
                            <label>Family</label>
                            <input
                                value={newProduct.family}
                                onChange={e => setNewProduct({ ...newProduct, family: e.target.value })}
                                placeholder="e.g., Araceae"
                            />
                        </div>
                        <div>
                            <label>Variety / Cultivar</label>
                            <input
                                value={newProduct.variety_cultivar}
                                onChange={e => setNewProduct({ ...newProduct, variety_cultivar: e.target.value })}
                                placeholder="e.g., 'Albo Variegata'"
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea
                                value={newProduct.description}
                                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                rows="3"
                            />
                        </div>
                        <div>
                            <label>Care Instructions</label>
                            <textarea
                                value={newProduct.instruction_notes}
                                onChange={e => setNewProduct({ ...newProduct, instruction_notes: e.target.value })}
                                rows="4"
                                placeholder="Light, temperature, humidity, watering, soil requirements"
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Price *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Stock</label>
                                <input
                                    type="number"
                                    value={newProduct.stock}
                                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label>Product Image</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="btn"
                                    style={{ backgroundColor: '#e5e7eb', flex: 1 }}
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Choose Image'}
                                </button>
                                {newProduct.image_path && (
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.25rem',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={`http://localhost:8000/${newProduct.image_path}`}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                            </div>
                            {newProduct.image_path && (
                                <small style={{ color: '#6b7280', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                                    {newProduct.image_path}
                                </small>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                {editingId ? 'Update' : 'Add'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="btn" style={{ flex: 1, backgroundColor: '#e5e7eb' }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div>
                    <h2 style={{ marginTop: 0 }}>Current Inventory ({products.length} products)</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden' }}>
                            <thead style={{ backgroundColor: '#f3f4f6' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Image</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Stock</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>{product.product_id}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {product.image_path && (
                                                <div style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '0.25rem' }}>
                                                    <img
                                                        src={`http://localhost:8000/${product.image_path}`}
                                                        alt={product.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }}>{product.name}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{product.category}</td>
                                        <td style={{ padding: '1rem' }}>${product.price}</td>
                                        <td style={{ padding: '1rem' }}>{product.stock}</td>
                                        <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
