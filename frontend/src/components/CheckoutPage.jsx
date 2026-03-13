import React, { useState,useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../Styles/CheckoutPage.css";


export default function CheckoutPage() {

  const { userId } = useParams();
  const [checkOuts, setCheckOuts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    fetchUserCheckOuts();
  }, []);

  const fetchUserCheckOuts = async () => {
    try{
      const response = await axios.get(`http://localhost:3636/checkout/${userId}`);
      const userCheckOuts = response.data;
      setCheckOuts(userCheckOuts);
      
    }catch(err){
      console.log("err");
    }
  }

  

  const handleAddOrder = async () => {
    const checkoutProducts = checkOuts.flatMap(c =>
      c.cart.map(p => ({
        ...p.product,
        size: p.size
      }))
    );
    const totalAmount = checkOuts.reduce((sum, c) => {
      return sum + Number(c.totalAmount);
    }, 0);
    await axios.post(`http://localhost:3636/orders/${userId}`,{
      idOrder:Date.now(),
      userId:Number(userId),
      name:form.name, // username auto
      address:form.address,
      city:form.city,
      phone:form.city,
      products:checkoutProducts,
      totalAmount:totalAmount, 
      status:"waiting" //delivering
    })

    handleDeleteCarte(userId); 
    handleDeleteCheckouts(userId);
  }

  const handleDeleteCarte = async (id) => {
    try{
      await axios.delete(`http://localhost:3636/deleteCart/${id}`);
    } catch (err) {
      console.error("Error deleting cart item:", err);
    }
  }

  const handleDeleteCheckouts = async (id) => {
    try{
      await axios.delete(`http://localhost:3636/deleteCheckout/${id}`);
    }catch(err){
      console.error("Error deleting checkout item:", err);
    }
    fetchUserCheckOuts();
  }
  

  return (
    <div className="checkout-wrapper">

      <h1 className="checkout-title">CHECKOUT</h1>

      <div className="checkout-container">

        {/* LEFT - SHIPPING */}
        <div className="checkout-left">

          <h2>🚚 Shipping</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
          />

          <h2>💳 Payment</h2>

          <div className="payment-options">
            <button className="payment-btn">Stripe</button>
            <button className="payment-btn">PayPal</button>
            <button className="payment-btn">Crypto</button>
          </div>

        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="checkout-right">

          <h2>Order Summary</h2>
          {checkOuts.length === 0 && <p>No orders found.</p>}
          {checkOuts.map((checkout) => (
            <React.Fragment key={checkout.checkOutId}>
              {checkout.cart.map((c) => (
                <div className="summary-item" key={c.cartId}>
                  <p>{c.product.name}</p>
                  <span>TND {c.product.price}</span>
                  <span>Size: {c.size}</span>
                </div>
              ))}

              <div className="summary-total">
                <h3>Total</h3>
                <h2>TND {checkout.totalAmount}</h2>
              </div>
            </React.Fragment>
          ))}

          

          <button className="complete-btn" onClick={handleAddOrder}>
            
            COMPLETE ORDER
          </button>

        </div>

      </div>
    </div>
  );
}
