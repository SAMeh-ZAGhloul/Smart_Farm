import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>Get in Touch</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>
                    Have a question about a plant? Need help with your order? We're here to help!
                </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                {status === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Message Sent!</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
                            Thank you for contacting us. We'll get back to you within 24 hours.
                        </p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setStatus('idle')}
                        >
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject">Subject</label>
                            <select
                                id="subject"
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                            >
                                <option value="">Select a topic...</option>
                                <option value="order">Order Inquiry</option>
                                <option value="plant_care">Plant Care Advice</option>
                                <option value="wholesale">Wholesale Inquiry</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                placeholder="How can we help you?"
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={status === 'submitting'}
                            style={{ alignSelf: 'flex-start' }}
                        >
                            {status === 'submitting' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </div>

            <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Email Us</h3>
                    <p style={{ color: 'var(--text-light)' }}>hello@smartfarm.com</p>
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Call Us</h3>
                    <p style={{ color: 'var(--text-light)' }}>+1 (555) 123-4567</p>
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Visit Us</h3>
                    <p style={{ color: 'var(--text-light)' }}>123 Green Street<br />Plant City, PC 12345</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
