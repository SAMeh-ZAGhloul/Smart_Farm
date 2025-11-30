import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        card: '',
        expiry: '',
        cvv: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [shipping, setShipping] = useState(0);

    React.useEffect(() => {
        const subtotal = getCartTotal();
        if (subtotal > 50) {
            setShipping(0);
        } else {
            setShipping(10);
        }
    }, [cart, getCartTotal]);

    const handleApplyDiscount = () => {
        if (discountCode.toUpperCase() === 'SAVE10') {
            setDiscount(getCartTotal() * 0.1);
            alert('Discount applied! You saved 10%.');
        } else {
            alert('Invalid discount code. Try "SAVE10"');
            setDiscount(0);
        }
    };

    const finalTotal = getCartTotal() - discount + shipping;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const orderData = {
                email: formData.email,
                name: formData.name,
                address: formData.address,
                city: formData.city,
                zip: formData.zip,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name
                })),
                total: finalTotal
            };

            await fetch('http://localhost:8000/send-order-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
        } catch (error) {
            console.error('Error sending email:', error);
        }

        // Simulate payment processing
        setTimeout(() => {
            alert(`Order placed successfully! Total charged: $${finalTotal.toFixed(2)}`);
            clearCart();
            setIsProcessing(false);
            navigate('/');
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Go Shopping</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', color: 'var(--primary-dark)' }}>Checkout</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Shipping Information</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} style={inputStyle} />
                            <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} style={inputStyle} />
                            <input type="text" name="address" placeholder="Street Address" required value={formData.address} onChange={handleChange} style={inputStyle} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} style={{ ...inputStyle, flex: 2 }} />
                                <input type="text" name="zip" placeholder="ZIP Code" required value={formData.zip} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Payment Details</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="text" name="card" placeholder="Card Number" required value={formData.card} onChange={handleChange} style={inputStyle} maxLength="19" />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <input type="text" name="expiry" placeholder="MM/YY" required value={formData.expiry} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} maxLength="5" />
                                <input type="text" name="cvv" placeholder="CVV" required value={formData.cvv} onChange={handleChange} style={{ ...inputStyle, flex: 1 }} maxLength="4" />
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            opacity: isProcessing ? 0.7 : 1,
                            cursor: isProcessing ? 'not-allowed' : 'pointer'
                        }}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : `Place Order ($${finalTotal.toFixed(2)})`}
                    </button>
                </form>

                {/* Order Summary */}
                <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '2rem',
                    borderRadius: '1rem',
                    height: 'fit-content',
                    border: '1px solid var(--border)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Summary</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '0.25rem', overflow: 'hidden', backgroundColor: '#e5e7eb' }}>
                                        {item.image_path && <img src={`http://localhost:8000/${item.image_path}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Qty: {item.quantity}</div>
                                    </div>
                                </div>
                                <span style={{ fontWeight: '500' }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1.5rem' }}>
                        {/* Discount Code Input */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Discount Code"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                style={{ ...inputStyle, marginBottom: 0 }}
                            />
                            <button className="btn btn-secondary" onClick={handleApplyDiscount}>Apply</button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                            <span>Subtotal</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'green' }}>
                                <span>Discount</span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-light)' }}>
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)' }}>
                            <span>Total</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    padding: '0.875rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%'
};

export default Checkout;
