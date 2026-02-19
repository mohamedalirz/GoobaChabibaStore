import "../Styles/ProductPage.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProductPage() {
  const [product, setProduct] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [size, setSize] = useState(["S", "M", "L", "XL", "XXL"]);
  const { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    fetchProductById();
  }, []);

  const fetchProductById = async () => {
    try{
        const response = await axios.get(`http://localhost:3636/products`);
        const foundProjuct = response.data.find(p => p.id === parseInt(id));
        setProduct(foundProjuct);
        
    }
    catch(error){
        console.error("Error fetching product:", error);
    }
  }
  
  const handleAddToCart = async () => {

  if (!selectedSize) {
    alert("Please select a size");
    return;
  }

  if (!product) {
    alert("Product not loaded yet");
    return;
  }

  try {
    await axios.post("http://localhost:3636/cart", {
      cartId: Date.now(),
      product: product,
      userId: 1,
      quantity: 1,
      size: selectedSize
    });
    console.log("Product added to cart successfully");
    navigate(`/cart/1`);

  } catch(error){
    console.error("Error adding to cart:", error);
  }
};

  

  return (
    <div className="product-page">

      <div className="product-container" key={product.id}>

        {/* LEFT SIDE */}
        <div className="image-section">
          <img src={product.image} alt="product" className="main-image" />

          <div className="thumbnails">
              <img
                src={product.image}
                alt="thumb"
              />
            
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="info-section">
          <span className="official-badge">Official GOOBA Merch</span>

          <h1>{product.name}</h1>
          <h2>TND{product.price}</h2>
          <h3>{product.description}</h3>

          <div className="sizes">
            <p>Select Size:</p>
              {size.map((s) => (
              <button
                key={s}
                className={selectedSize === s ? "active" : ""}
                onClick={() => setSelectedSize(s)}
              >
                {s}
              </button>
              
            ))}
  
          </div>

          <button className="add-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>

      </div>

      {/* Reviews 
      <div className="reviews">
        <h3>Customer Reviews</h3>
        <p>⭐⭐⭐⭐⭐ Amazing quality!</p>
        <p>⭐⭐⭐⭐ Great hoodie for streaming 🔥</p>
      </div>
      */}

      {/* Related Products 
      <div className="related">
        <h3>Related Products</h3>
        <div className="related-grid">
          <div className="related-card">GOOBA Cap</div>
          <div className="related-card">CHABIBA T-Shirt</div>
          <div className="related-card">Limited Edition Hoodie</div>
        </div>
      </div>
      */}

    </div>
  );
}

export default ProductPage;
