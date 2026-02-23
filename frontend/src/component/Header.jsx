import { FaShoppingCart, FaUser, FaBars } from "react-icons/fa";
import { useState } from "react";
import "./header.css";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="logo">GOOBA</div>

        {/* Desktop Nav */}
        <nav className="nav desktop-nav">
          <a href="/" className="nav-link active">HOME</a>
          <a href="/ProductDetails/:id" className="nav-link">SHOP</a>
          <a href="#membership" className="nav-link">MEMBERSHIP</a>
          <a href="https://kick.com/gooba_off" target="_blank" rel="noopener noreferrer" className="nav-link">LIVE</a>
          <a href="/Footer" className="nav-link">ABOUT</a>
        </nav>

        <div className="right-section">
          

          <div className="gold-icon">
            <a href="/cart/:userId"><FaShoppingCart /></a>
          </div>

          {/* Mobile Menu Icon */}
          <FaBars className="menu-icon" onClick={() => setOpen(!open)} />
        </div>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${open ? "active" : ""}`}>
        <a href="/">HOME</a>
        <a href="/">SHOP</a>
        <a href="#membership">MEMBERSHIP</a>
        <a href="https://kick.com/gooba_off" target="_blank" rel="noopener noreferrer">LIVE</a>
        <a href="/Footer">ABOUT</a>
      </div>
    </>
  );
}

export default Header;