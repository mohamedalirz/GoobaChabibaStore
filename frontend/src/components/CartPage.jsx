import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Styles/CartPage.css";

export default function CartPage() {
  const { userId } = useParams();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const cartRes = await axios.get(`http://localhost:3636/cart/${userId}`);
      const cartItems = cartRes.data;
      setCart(cartItems);
      const productList = cartItems.map(item => item.product);
      setProducts(productList);

    } catch (error) {
      console.error("Error fetching cart or products:", error);
    }
  };

 
  

  const handleAddCheckOut = async () => {
    const totalAmount = cart.reduce((total, item) => {
      return total + (item.product ? item.product.price * item.quantity : 0);
    }, 0);
    
    try {
        await axios.post("http://localhost:3636/checkout", {
            checkOutId: Date.now(),
            cart:cart,
            totalAmount: totalAmount,
            userId:Number(userId)
        })
        navigate(`/checkout/${userId}`);
    }
     catch (error) {
      console.error("Error placing order:", error);
    }
};


  return (<>
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.length === 0 && <p>Your cart is empty.</p>}
      {cart.map((item) => {
        
        return (
          <div className="cart-item" key={item.cartId}>
            <img
              src={item.product.image || "https://via.placeholder.com/150"}
              alt={item.product.name || "product"}
            />
            <div>
              <h3>{item.product.name || "Loading..."}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Size: {item.size}</p>
              <div className="quantity">
                <button>-</button>
                <span>{item.quantity}</span>
                <button>+</button>
              </div>
            </div>
            <h2>Total: TND{item.product ? (item.product.price * item.quantity).toFixed(2) : "0"}</h2>
          </div>
          
        );
      })}
      <button onClick={handleAddCheckOut}>CHeck Out</button>
    </div>
    
  </>);
}
