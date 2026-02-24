import '../App.css';
import HomePage from './HomePage';
import Profile from "./Profile";
import ProductDetails from './ProductDetails';
import Cart from './Cart'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from './Shop';
import Slidebar from './Slidebar';
function Main() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/ProductDetails/:id" element={<ProductDetails />} />
          <Route path="/Cart" element={<Cart/>} />
          <Route path="/Shop" element={<Shop/>} />
          <Route path="/Slidebar" element={<Slidebar/>} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default Main;
