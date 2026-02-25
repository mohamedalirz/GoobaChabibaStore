import { useState } from "react";
import "../Styles/Cart.css";
import { useNavigate } from "react-router-dom";
import hoodie from "../assets/capuche.png";
import tshirt from "../assets/capuche.png";

function Cart() {
  const navigate = useNavigate();
  const [qty1, setQty1] = useState(2);
  const [qty2, setQty2] = useState(3);

  const price1 = 59.99;
  const price2 = 39.99;

  const total = (qty1 * price1 + qty2 * price2).toFixed(2);

  return (
    <div className="cart-wrapper">

      <div className="fire-bg"></div>
      <div className="particles"></div>

      <div className="cart-container">
        <h1 className="cart-title">CART</h1>

        {/* ITEM 1 */}
        <div className="cart-item">
          <img src={hoodie} alt="Hoodie" />

          <div className="item-info">
            <h3>CHABIBA Hoodie</h3>
            <p>${price1}</p>
          </div>

          <div className="item-actions">
            <div className="qty-box">
              <button onClick={() => setQty1(qty1 > 1 ? qty1 - 1 : 1)}>-</button>
              <span>{qty1}</span>
              <button onClick={() => setQty1(qty1 + 1)}>+</button>
            </div>
            <div className="item-total">${(qty1 * price1).toFixed(2)}</div>
          </div>
        </div>

        {/* ITEM 2 */}
        <div className="cart-item">
          <img src={tshirt} alt="Tshirt" />

          <div className="item-info">
            <h3>GOOBA T-Shirt</h3>
            <p>${price2}</p>
          </div>

          <div className="item-actions">
            <div className="qty-box">
              <button onClick={() => setQty2(qty2 > 1 ? qty2 - 1 : 1)}>-</button>
              <span>{qty2}</span>
              <button onClick={() => setQty2(qty2 + 1)}>+</button>
            </div>
            <div className="item-total">${(qty2 * price2).toFixed(2)}</div>
          </div>
        </div>

        <div className="cart-footer">
          <div className="total">
            <span>Total</span>
            <strong>${total}</strong>
          </div>
          <button className="checkout-btn" onClick={() => navigate("/checkout")}>ADD TO CART</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;