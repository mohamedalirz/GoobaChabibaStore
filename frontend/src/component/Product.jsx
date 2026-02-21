import "../Styles/HomePage.css";
import hoodie from "../assets/capuche.png";


function Product(){
    return (
        <div className="card">
            <div className="card-glow"></div>
            <img src={hoodie} alt="Hoodie" />
            <h3>CHABIBA Hoodie</h3>
            <p>$59.99</p>
            <button className="btn-gold">ADD TO CART</button>
        </div>
    );
}

export default Product;