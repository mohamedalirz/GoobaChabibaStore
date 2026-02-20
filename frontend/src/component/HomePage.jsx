import "../Styles/HomePage.css";
import Product from "./Product" 

function HomePage(){
    return (<>
        <div className="hero-banner"> 
            <div className="hero-btn">
                <button>
                <span>SHOP NOW</span>
                </button>
                <button>
                <span>WATCH LIVE</span>
                </button>
            </div>
        </div>
        <div className="chabiba-drop">
            <h1>🔥CHABIBA DROP</h1>
            <div className="chabiba-products">
                <Product />
                <Product />
                <Product />
            </div>
        </div>
    </>);
}

export default HomePage;