import { useState } from "react";
import "../Styles/ProductDetails.css";
import hoodieImage from "../assets/capuche.png";

export default function ProductPage() {

  const [size, setSize] = useState("XL");

  const sizes = ["S", "M", "L", "XL"];

  return (
    <div className="page">

      {/* SIDEBAR */}
      <div className="sidebar">

        <div className="section">
          <div className="section-title">CATEGORIES</div>

          <div className="category active">Hoodies</div>
          <div className="category">T-Shirts</div>
          <div className="category">Caps</div>
          <div className="category">Accessories</div>
          <div className="category">Digital Content</div>
        </div>


        <div className="section">
          <div className="section-title">BOOSTS</div>

          <label><input type="checkbox"/> Soft</label>
          <label><input type="checkbox"/> Hard</label>
          <label><input type="checkbox"/> Ultra</label>
        </div>


        <div className="section">
          <div className="section-title">PRICE</div>

          <input type="range" className="slider"/>

          <div className="price-labels">
            <span>$14</span>
            <span>$91+</span>
          </div>
        </div>

      </div>


      {/* MAIN */}
      <div className="main">

        <div
      className="hero"
      style={{
        backgroundImage: `url(${hoodieImage})`
      }}
    >

      <div className="overlay">

        <h1 className="title">
          CHABIBA Hoodie
        </h1>

        <div className="price">
          $59.99
        </div>

        <div className="sizes">
          <button>S</button>
          <button>M</button>
          <button>L</button>
          <button>XL</button>
        </div>

        <button className="add-btn">
          ADD TO CART
        </button>

      </div>

    </div>

      </div>

    </div>
  );
}