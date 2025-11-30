import React from 'react';
import { useCart } from '../context/CartContext';

const ProductDetailModal = ({ product, onClose }) => {
    const { addToCart } = useCart();

    if (!product) return null;

    const imageUrl = product.image_path
        ? `http://localhost:8000/${product.image_path}`
        : null;

    const isOutOfStock = product.stock === 0;

    const handleAddToCart = () => {
        if (!isOutOfStock) {
            addToCart(product);
            // Optional: Close modal after adding to cart? 
            // For now, let's keep it open so they can read more or add more.
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                padding: '2rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                animation: 'slideUp 0.3s ease-out'
            }} onClick={e => e.stopPropagation()}>

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        color: 'var(--text-light)',
                        lineHeight: 1,
                        zIndex: 10
                    }}
                    aria-label="Close modal"
                >
                    &times;
                </button>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 350px' }}>
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    borderRadius: '0.5rem',
                                    objectFit: 'cover',
                                    maxHeight: '500px'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '300px',
                                backgroundColor: '#f3f4f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#9ca3af',
                                borderRadius: '0.5rem'
                            }}>
                                No Image
                            </div>
                        )}
                    </div>

                    <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.25rem', color: 'var(--text)', marginBottom: '0.5rem', lineHeight: 1.2 }}>{product.name}</h2>
                            {product.species_botanical_name && (
                                <p style={{ fontStyle: 'italic', color: 'var(--text-light)', fontSize: '1.1rem' }}>
                                    {product.species_botanical_name}
                                </p>
                            )}
                            {product.product_id && (
                                <span style={{
                                    display: 'inline-block',
                                    marginTop: '0.5rem',
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-light)'
                                }}>
                                    ID: {product.product_id}
                                </span>
                            )}
                        </div>

                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            ${product.price.toFixed(2)}
                        </div>

                        <div style={{ lineHeight: '1.7', color: 'var(--text-light)', fontSize: '1.05rem' }}>
                            {product.description || 'No description available.'}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                            {isOutOfStock ? (
                                <div className="badge badge-danger" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem', display: 'inline-block' }}>
                                    Out of Stock
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleAddToCart}
                                        style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}
                                    >
                                        Add to Cart
                                    </button>
                                    {product.stock <= 5 && (
                                        <span style={{ color: '#d97706', fontWeight: '500' }}>
                                            Only {product.stock} left!
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ProductDetailModal;
