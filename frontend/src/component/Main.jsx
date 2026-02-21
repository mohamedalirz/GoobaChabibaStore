import '../App.css';
import HomePage from './HomePage';
import Profile from "./Profile";
import ProductDetails from './ProductDetails';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function Main() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/ProductDetails/:id" element={<ProductDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default Main;
