import "./Slidebar.css";

function Sidebar() {
  return (
    <aside className="shop-sidebar">

      {/* CATEGORIES */}
      <div className="section">
        <div className="section-title">CATEGORIES</div>

        <div className="category active">Hoodies</div>
        <div className="category">T-Shirts</div>
        <div className="category">Caps</div>
        <div className="category">Accessories</div>
        <div className="category">Digital Content</div>
      </div>

      {/* BOOSTS */}
      <div className="section">
        <div className="section-title">BOOSTS</div>

        <label className="checkbox">
          <input type="checkbox" />
          <span>Soft</span>
        </label>

        <label className="checkbox">
          <input type="checkbox" />
          <span>Hard</span>
        </label>

        <label className="checkbox">
          <input type="checkbox" />
          <span>Ultra</span>
        </label>
      </div>

      {/* PRICE */}
      <div className="section">
        <div className="section-title">PRICE</div>

        <input type="range" className="slider" />

        <div className="price-labels">
          <span>$14</span>
          <span>$91+</span>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;