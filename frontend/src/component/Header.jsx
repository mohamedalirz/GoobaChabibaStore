import { FaShoppingCart, FaUser, FaTrophy } from "react-icons/fa";
import "./header.css";

function Header() {
  return (
    <header className="header">

      
      <div className="logo">
        GOOBA
      </div>

      
      <nav className="nav">
        <a href="/" className="nav-link active">HOME</a>
        <a href="/" className="nav-link">SHOP</a>
        <a href="#membership" className="nav-link">MEMBERSHIP</a>
        <a href="https://kick.com/gooba_off" target="_blank" rel="noopener noreferrer" className="nav-link">LIVE</a>
        <a href="/Footer" className="nav-link">ABOUT</a>

      </nav>

     
      <div className="right-section">
        <a href="/Profile"><FaUser className="small-icon" /></a>

        <div className="gold-icon">
          <a href="/cart/:userId"><FaShoppingCart /></a>
        </div>
      </div>

    </header>
  );
}

export default Header;