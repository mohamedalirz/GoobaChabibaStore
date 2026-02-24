import { useState } from "react";
import "../Styles/ProductDetails.css";
import hoodieImage from "../assets/capuche.png";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const [size, setSize] = useState("XL");
  const sizes = ["S", "M", "L", "XL"];
  const navigate = useNavigate();

  return (
    <div className="product-page">

      <div className="product-container">

        {/* IMAGE SECTION */}
        <div className="product-image-box">
          <img src={hoodieImage} alt="Product" />
        </div>

        {/* DETAILS SECTION */}
        <div className="product-info">

          <h1 className="product-title">CHABIBA Hoodie</h1>

          <p className="product-price">$59.99</p>

          <div className="sizes">
            {sizes.map((s) => (
              <button
                key={s}
                className={size === s ? "active-size" : ""}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            className="add-btn"
            onClick={() => navigate("/cart")}
          >
            ADD TO CART
          </button>

        </div>

      </div>
    </div>
  );
}