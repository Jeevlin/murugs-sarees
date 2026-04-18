import { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { FaShoppingCart}from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect } from "react";  
import { NavLink } from "react-router-dom";
import { useMemo } from "react";
import CartDrawer from "./cartDrawer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Navbar({ isCartOpen, setIsCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { cart } = useCart();
  const totalItems = useMemo(() => {
      return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, []);
    useEffect(() => {
      const handleScroll = () => {
       setScrolled(window.scrollY > 20);
     };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".navbar")) {
      setMenuOpen(false);
      setProductOpen(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

  return (
    <>
     <div className="topbar">
        <span> </span>
        <span>Free Shipping on Orders Above ₹2000</span>
      </div>
  
  <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}> Murugs
      <span>Sarees</span></Link>

    <div className={`hamburger ${menuOpen ? "open" : ""}`}onClick={() => setMenuOpen(!menuOpen)}>
     ☰
    </div>

     <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}
       onClick={() => setMenuOpen(false)}>Home</NavLink></li>

        <li className="dropdown">
<div 
  className={`dropdown-title ${productOpen ? "open" : ""}`}
  onClick={() => {
    if (window.innerWidth < 768) {
      setProductOpen(!productOpen);
    }
  }}
>
  <span><Link to="/category" onClick={() => setMenuOpen(false)}>Products</Link></span>
  <FaChevronDown className="product-arrow" />
</div>

<ul className={`dropdown-menu ${productOpen ? "show" : ""}`}>
  {categories.map((cat) => (
    <li key={cat.id}>
      <Link
        to={`/category/${cat.name.toLowerCase()}`}
        onClick={() => {
          setMenuOpen(false);
          setProductOpen(false);
        }}
      >
        {cat.name}
      </Link>
    </li>
  ))}
</ul>
        </li>

        <li><Link to="/reviews"onClick={() => setMenuOpen(false)}>Reviews</Link></li>
        <li><Link to="/about"  onClick={() => setMenuOpen(false)}>About us</Link></li>
        <li><Link to="/contact"onClick={() => setMenuOpen(false)}>Contact</Link></li>
     
 
      </ul>

         <div className="cart-wrapper">
  
    
<button  className="cart-icon"  onClick={() => setIsCartOpen(true)}>🛒</button>

<CartDrawer isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)} />
  {totalItems > 0 && !isCartOpen && (
  <span className="cart-count">{totalItems}</span>
)}
</div>
    </nav>
    </>
  );
}

export default Navbar;