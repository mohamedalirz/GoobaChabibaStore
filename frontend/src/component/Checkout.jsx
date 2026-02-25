import { useState } from "react";
import "../Styles/Checkout.css";

function Checkout() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    numero: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="checkout-wrapper">

      <div className="fire-bg"></div>
      <div className="particles"></div>

      <div className="checkout-container">

        <div className="checkout-form">
          <h2>Checkout</h2>

          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="email" placeholder="Email Address" onChange={handleChange} />
          <input name="address" placeholder="Shipping Address" onChange={handleChange} />
          <input name="city" placeholder="City" onChange={handleChange} />
          <input name="numero" placeholder="+216" onChange={handleChange} />

          <button className="pay-btn">COMPLETE PURCHASE</button>
        </div>

        <div className="order-summary">
  <h3 className="summary-title">Order Summary</h3>

  <div className="summary-product">
    <img src="/hoodie.png" alt="Hoodie" />
    <div className="product-info">
      <p>CHABIBA Hoodie</p>
      <span className="qty">Qty: 1</span>
    </div>
    <span className="price">$59.99</span>
  </div>

    <div className="summary-product">
        <img src="/tshirt.png" alt="Tshirt" />
        <div className="product-info">
        <p>GOOBA T-Shirt</p>
        <span className="qty">Qty: 1</span>
        </div>
        <span className="price">$39.99</span>
    </div>

    <div className="summary-divider"></div>

    <div className="summary-row">
        <span>Subtotal</span>
        <span>$99.98</span>
    </div>

    <div className="summary-row">
        <span>Shipping</span>
        <span>Free</span>
    </div>

    <div className="summary-row">
        <span>Tax</span>
        <span>$0.00</span>
    </div>

    <div className="summary-total">
        <span>Total</span>
        <strong>$99.98</strong>
    </div>

    <button className="secure-checkout">
        🔒 Secure Checkout
    </button>
    </div>

      </div>
    </div>
  );
}

export default Checkout;