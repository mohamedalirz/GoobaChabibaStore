import "../Styles/HomePage.css";
import hoodie from "../assets/capuche.png";
import { useNavigate } from "react-router-dom";


function Product(){
    const navigate = useNavigate();
    return (
        <div className="card">
            <div className="card-glow"></div>
            <img src={hoodie} alt="Hoodie" />
            <h3>CHABIBA Hoodie</h3>
            <p>$59.99</p>
            <button className="btn-gold" onClick={() => navigate("/ProductDetails/id")}>ADD TO CART</button>
        </div>
    );
}

export default Product;