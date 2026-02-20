import "../Styles/HomePage.css";
import capuche from "../assets/capuche.png";


function Product(){
    return (
        <div className="product">            
                <div className="product-img">
                    <img src={capuche} alt="CHABIBA Capuche" />
                </div>
                    
                <div className="product-details">
                    <h2>CHABIBA CAPUCHE</h2>
                    <p>60 DT</p>
                    <button>
                    <span>Add To Cart</span>
                </button>
            </div>
        </div>
    );
}

export default Product;