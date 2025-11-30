import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import ProductCard from '../components/ProductCard';

import ProductDetailModal from '../components/ProductDetailModal';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={() => setSelectedProduct(product)}
                        />
                    ))}
                </div>
            )}

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}

            {/* About Us Section */}
            <section style={{ marginTop: '6rem', marginBottom: '4rem' }}>
                <div style={{
                    backgroundColor: 'var(--secondary)',
                    borderRadius: '2rem',
                    padding: '4rem 2rem',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>About Smart Farm</h2>
                    <p style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        color: 'var(--primary-dark)'
                    }}>
                        We are passionate about bringing the beauty of nature into your home.
                        Our team of botanists and plant enthusiasts curates the finest selection of rare and exotic plants from around the world.
                        We believe that every plant has a story, and we're here to help you start your own green journey.
                    </p>
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ marginBottom: '6rem' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2rem', color: 'var(--text)', marginBottom: '3rem' }}>Why Choose Us</h2>
                <div className="grid grid-cols-1" style={{ gap: '2rem' }}>
                    {[
                        { title: 'Expertly Curated', desc: 'Hand-picked by our team of expert botanists for health and beauty.' },
                        { title: 'Sustainable Sourcing', desc: 'We partner with eco-friendly growers who prioritize the planet.' },
                        { title: 'Care Support', desc: 'Lifetime support from our plant doctors for every plant you buy.' },
                        { title: 'Safe Shipping', desc: 'Specialized packaging ensures your plants arrive happy and healthy.' }
                    ].map((item, index) => (
                        <div key={index} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.25rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-light)' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Join Our Community</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Get plant care tips, new arrival alerts, and exclusive discounts.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
                    <input type="email" placeholder="Enter your email" style={{ marginBottom: 0 }} />
                    <button className="btn btn-primary">Subscribe</button>
                </div>
            </section>
        </div>
    );
};

export default Home;
