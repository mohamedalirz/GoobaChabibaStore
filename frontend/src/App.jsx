import './App.css';
import ShopPage from './components/ShopPage';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import AdminDashboard from './admin/AdminDashboard';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart/:userId" element={<CartPage />} />
          <Route path="/checkout/:userId" element={<CheckoutPage />} />
          <Route path="/admin" element={<AdminDashboard />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
