import "../Styles/HomePage.css";
import logo from "../assets/goobalogo.png"
import hoodie from "../assets/capuche.png";
import Product from "./Product";

function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          
          <img src={logo} />
          <h2 className="collection-text">CHABIBA COLLECTION</h2>

          <div className="hero-buttons">
            <button className="btn-gold">SHOP NOW</button>
            <button className="btn-blue">WATCH LIVE</button>
          </div>
        </div>
      </section>

      {/* ================= DROP SECTION ================= */}
      <section className="drop">
        <h2 className="drop-title">🔥 CHABIBA DROP</h2>
        <div className="products">
            <Product />
            <Product />
            <Product />
        </div>
      </section>

      <section className="offers">
        <h2 className="offers-title">⚡ SPECIAL OFFERS</h2>

        <div className="offers-container">
            <div className="offer-card">

                <div className="offer-badge">-30%</div>

                <div className="offer-image">
                <img src={hoodie} alt="Limited Hoodie" />
                </div>

                <div className="offer-content">
                <h3>LIMITED HOODIE SALE</h3>
                <p className="old-price">$89.99</p>
                <p className="new-price">$59.99</p>
                <button className="btn-gold">SHOP NOW</button>
                </div>

            </div>
        </div>
        </section>
    </>
  );
}

export default HomePage;