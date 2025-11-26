import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                console.log("Fetching products...");
                const data = await fetchProducts();
                console.log("Products received:", data);
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
    if (error) return <div className="container" style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                    Bring Nature Home
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
                    Discover our curated collection of rare and beautiful plants, sourced from the best growers.
                </p>
            </header>

            {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    <p style={{ fontSize: '1.2rem' }}>No products found. Please run the populate_db.py script to add products.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
