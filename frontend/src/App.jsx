import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';

function App() {
  return (
    <CartProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
            <div className="container">
              <p>&copy; 2024 Smart Farm. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
