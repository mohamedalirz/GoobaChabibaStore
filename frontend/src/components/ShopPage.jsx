import { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "../Styles/ShopPage.css";

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
    fetchCategory();
  }, []);
  

  const fetchAllProducts = async () => {
    try{
      const response = await axios.get("http://localhost:3636/products");
      setProducts(response.data);
    }catch(error){
      console.error("Error fetching products:", error);
    }
  }

  const fetchCategory = async () => {
    try{
      const response = await axios.get("http://localhost:3636/category");
      setCategory(response.data);
    }
    catch(error){
      console.error("Error fetching category:", error);
    }
  }

  const filteredProducts = filteredCategory === "All" ? products : products.filter(p => p.category === filteredCategory);


  return (
    <div className="shop-wrapper">
      
      <div className="sidebar">
        <h3>Categories</h3>
        <ul>
          {category.map((c) => {
            return (
              <li key={c} onClick={() => {setFilteredCategory(c)}}>{c}</li>
            )
          })}
          
        </ul>

      </div>

      <div className="products">
        {filteredProducts.map((p) => (
          <div onClick={() => {navigate(`/product/${p.id}`)}} className="product-card" key={p.id}>
            <span className="badge">CHABIBA</span>
            
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
            <button>To Product</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopPage;