import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Footer from "./components/Footer";
import CategoryCard from "./pages/Categorycard";
import ReviewSlider from "./pages/Reviewslider";
import Categoryproducts from "./pages/Categoryproducts";
import ProductDetails from "./pages/Productdetails";
import Contact from "./pages/Contact";
    import "./styles/global.css";
import WhatsAppChat from "./components/WhatsAppChat";
import Cart from "./pages/Cart";
import { useState } from "react";

function App() {
      const [isCartOpen, setIsCartOpen] = useState(false);  
 const [openCart, setOpenCart] = useState(false);
  return (
     <div className="app-container">
    <BrowserRouter>

      <Navbar 
  isCartOpen={isCartOpen}
  setIsCartOpen={setIsCartOpen}
/>
     <div className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<ReviewSlider />} />
        <Route path="/category" element={<CategoryCard/>} />
          <Route path="/category/:name" element={<Categoryproducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
      </Routes>
      </div>
<Footer />


    </BrowserRouter>
   {!isCartOpen && <WhatsAppChat />}
    </div>
  );
}

export default App;