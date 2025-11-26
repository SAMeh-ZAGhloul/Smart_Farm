import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, X, Menu, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cart, getCartCount, getCartTotal, removeFromCart, updateQuantity } = useCart();
    const [showCart, setShowCart] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <>
            {/* Announcement Bar */}
            <div style={{
                backgroundColor: var(--primary),
            color: 'white',
            textAlign: 'center',
            padding: '0.75rem',
            fontSize: '0.9rem',
            fontWeight: '500'
      }}>
            🌿 Free shipping on orders over $50 • New arrivals weekly
        </div >

            <nav style={{
                backgroundColor: 'white',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.5rem'
                }}>
                    {/* Logo */}
                    <Link to="/" style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        color: 'var(--primary)',
                        letterSpacing: '-0.02em'
                    }}>
                        🌱 Smart Farm
                    </Link>

                    {/* Desktop Navigation */}
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                        '@media (max-width: 768px)': { display: 'none' }
                    }}>
                        <Link to="/" style={{
                            color: 'var(--text)',
                            fontWeight: '500',
                            transition: 'color 0.2s'
                        }}>
                            Shop All
                        </Link>
                        <Link to="/" style={{ color: 'var(--text)', fontWeight: '500' }}>
                            New Arrivals
                        </Link>
                        <Link to="/" style={{ color: 'var(--text)', fontWeight: '500' }}>
                            Categories
                        </Link>
                    </div>

                    {/* Right Icons */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <button style={{ background: 'none', border: 'none', padding: 0 }}>
                            <Search size={22} color="var(--text)" />
                        </button>
                        <Link to="/admin">
                            <User size={22} color="var(--text)" />
                        </Link>
                        <button
                            style={{ background: 'none', border: 'none', padding: 0, position: 'relative' }}
                            onClick={() => setShowCart(!showCart)}
                        >
                            <ShoppingCart size={22} color="var(--text)" />
                            {getCartCount() > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {getCartCount()}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

    {/* Cart Sidebar */ }
    {
        showCart && (
            <>
                <div
                    className="fade-in"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        zIndex: 998,
                        backdropFilter: 'blur(2px)'
                    }}
                    onClick={() => setShowCart(false)}
                />
                <div
                    className="slide-in"
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '420px',
                        maxWidth: '90vw',
                        backgroundColor: 'white',
                        zIndex: 999,
                        boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Cart Header */}
                    <div style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'var(--background-alt)'
                    }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
                                Shopping Cart
                            </h2>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCart(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: 'var(--radius)',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--background)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                        {cart.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                color: 'var(--text-light)',
                                marginTop: '3rem'
                            }}>
                                <ShoppingCart size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                <p style={{ fontSize: '1.1rem' }}>Your cart is empty</p>
                                <p style={{ fontSize: '0.9rem' }}>Add some plants to get started!</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginBottom: '1.5rem',
                                    padding: '1rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    transition: 'box-shadow 0.2s',
                                    ':hover': { boxShadow: 'var(--shadow)' }
                                }}>
                                    <div style={{
                                        width: '90px',
                                        height: '90px',
                                        flexShrink: 0,
                                        backgroundColor: 'var(--background-alt)',
                                        borderRadius: 'var(--radius)',
                                        overflow: 'hidden'
                                    }}>
                                        {item.image_path && (
                                            <img
                                                src={`http://localhost:8000/${item.image_path}`}
                                                alt={item.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: '600' }}>
                                            {item.name}
                                        </h4>
                                        {item.species_botanical_name && (
                                            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                                {item.species_botanical_name}
                                            </p>
                                        )}
                                        <p style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: '600', color: 'var(--primary)' }}>
                                            ${item.price.toFixed(2)}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        border: 'none',
                                                        background: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        color: 'var(--text-light)'
                                                    }}
                                                >
                                                    −
                                                </button>
                                                <span style={{
                                                    padding: '0.25rem 1rem',
                                                    borderLeft: '1px solid var(--border)',
                                                    borderRight: '1px solid var(--border)',
                                                    fontWeight: '500'
                                                }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        border: 'none',
                                                        background: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '1rem',
                                                        fontWeight: '600',
                                                        color: 'var(--primary)'
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{
                                                    marginLeft: 'auto',
                                                    color: '#dc2626',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Footer */}
                    {cart.length > 0 && (
                        <div style={{
                            padding: '1.5rem',
                            borderTop: '1px solid var(--border)',
                            backgroundColor: 'var(--background-alt)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '1rem',
                                fontSize: '1.1rem'
                            }}>
                                <span style={{ fontWeight: '500' }}>Subtotal:</span>
                                <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary)' }}>
                                    ${getCartTotal().toFixed(2)}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                                Shipping calculated at checkout
                            </p>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '600' }}
                                onClick={() => alert('Checkout functionality coming soon!')}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </div>
            </>
        )
    }
    </>
  );
};

export default Navbar;
