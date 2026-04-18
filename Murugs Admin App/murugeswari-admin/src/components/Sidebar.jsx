import { NavLink } from "react-router-dom"
import { FaTachometerAlt, FaShoppingCart, FaBoxes,FaStar,FaTags } from "react-icons/fa"
import { FaTimes } from "react-icons/fa"
import "./Sidebar.css"

function Sidebar({ open, setOpen }) {

 return(
  <div className={`sidebar ${open ? "active" : ""}`}>

    <div className="sidebar-header">
      <h2 className="sidebar-title">Admin Panel</h2>

      <button
        className="close-btn"
        onClick={() => setOpen(false)}
      >
        <FaTimes/>
      </button>
    </div>

    <nav className="sidebar-menu">

      <NavLink to="/dashboard" className="menu-item">
        <FaTachometerAlt className="menu-icon"/>
        Dashboard
      </NavLink>

      <NavLink to="/orders" className="menu-item">
        <FaShoppingCart className="menu-icon"/>
        Orders
      </NavLink>

      <NavLink to="/inventory" className="menu-item">
        <FaBoxes className="menu-icon"/>
        Inventory
      </NavLink>
            <NavLink to="/categories" className="menu-item">
        <FaTags className="menu-icon"/>
        Categories
      </NavLink>
        <NavLink to="/reviews" className="menu-item">
        <FaStar className="menu-icon"/>
        Reviews
      </NavLink>

    </nav>

  </div>
 )

}

export default Sidebar