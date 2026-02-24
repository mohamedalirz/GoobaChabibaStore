
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { SiKick } from "react-icons/si"; // Kick icon
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h2>About Chabiba Brand</h2>
        <p>
          Chabiba Brand is the official merchandise store of the streamer Gooba.
          Shop exclusive t-shirts, hoodies, caps, and scarves to support your
          favorite streamer in style!
        </p>
        <p>
          Quality, comfort, and style — all crafted for Chabiba fans.
        </p>

        <div className="footer-socials">
          <a
            href="https://kick.com/gooba_off"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiKick />
          </a>
          <a
            href="https://www.instagram.com/gooba_official/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.youtube.com/@GooBa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2026 Chabiba. All Rights Reserved. Powered by Devign</p>
          <img
            src="/devign.png" 
            alt="Devign Logo"
            className="devign-logo"
          />
          
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;