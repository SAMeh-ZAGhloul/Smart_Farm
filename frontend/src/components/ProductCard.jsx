import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const imageUrl = product.image_path
        ? `http://localhost:8000/${product.image_path}`
        : null;

    const handleAddToCart = () => {
        if (product.stock > 0) {
            addToCart(product);
        }
    };

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div className="card fade-in">
            {/* Image Container */}
            <div style={{
                position: 'relative',
                height: '280px',
                overflow: 'hidden',
                backgroundColor: '#f9fafb'
            }}>
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #9ca3af; font-size: 0.9rem;">No Image</div>';
                        }}
                    />
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#9ca3af',
                        fontSize: '0.9rem'
                    }}>
                        No Image
                    </div>
                )}

                {/* Stock Badge */}
                {isOutOfStock && (
                    <div className="badge badge-danger" style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem'
                    }}>
                        Sold Out
                    </div>
                )}
                {isLowStock && (
                    <div className="badge badge-warning" style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem'
                    }}>
                        Only {product.stock} left
                    </div>
                )}

                {/* Product ID Badge */}
                {product.product_id && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: 'var(--text-light)',
                        backdropFilter: 'blur(4px)'
                    }}>
                        {product.product_id}
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem' }}>
                {/* Title */}
                <h3 style={{
                    margin: '0 0 0.5rem',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    lineHeight: '1.4',
                    color: 'var(--text)',
                    minHeight: '2.8rem'
                }}>
                    {product.name}
                </h3>

                {/* Botanical Name */}
                {product.species_botanical_name && product.species_botanical_name !== product.name && (
                    <p style={{
                        fontSize: '0.85rem',
                        fontStyle: 'italic',
                        color: 'var(--text-light)',
                        marginBottom: '0.75rem',
                        lineHeight: '1.3'
                    }}>
                        {product.species_botanical_name}
                    </p>
                )}

                {/* Description */}
                <div
                    style={{
                        color: 'var(--text-light)',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        height: '4.5rem',
                        overflow: 'auto',
                        paddingRight: '0.5rem',
                        lineHeight: '1.5'
                    }}
                >
                    {product.description || 'No description available'}
                </div>

                {/* Price and Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)'
                }}>
                    <div>
                        <span style={{
                            fontWeight: '700',
                            fontSize: '1.35rem',
                            color: 'var(--primary)'
                        }}>
                            ${product.price.toFixed(2)}
                        </span>
                    </div>
                    <button
                        className="btn btn-primary"
                        style={{
                            fontSize: '0.875rem',
                            padding: '0.625rem 1.25rem'
                        }}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
