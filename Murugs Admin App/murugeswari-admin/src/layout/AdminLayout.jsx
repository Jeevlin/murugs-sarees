import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/sidebar"
import { useAuth } from "../context/AuthContext"

import "./AdminLayout.css"

function AdminLayout(){

 const [open,setOpen] = useState(false)
 const { logout } = useAuth()
 const [showLogoutModal, setShowLogoutModal] = useState(false);
 return(

  <div className="admin-layout">

    <Sidebar open={open} setOpen={setOpen}/>

    <div className="admin-main">

      <div className="topbar">

        <button
          className="menu-btn"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>

        <div className="admin-name">
          Admin-Murugs
        </div>

        <button className="logout-btn"onClick={() => setShowLogoutModal(true)}>
          Logout
        </button>
{showLogoutModal && (
  <div className="logout-modal-overlay">

    <div className="logout-modal">

      <h3>Confirm Logout</h3>
      <p>Are you sure you want to logout?</p>

      <div className="modal-actions">

        <button
          className="cancel-btn"
          onClick={() => setShowLogoutModal(false)}
        >
          Cancel
        </button>

        <button
          className="confirm-btn"
          onClick={async () => {
            await logout();
            navigate("/");
          }}
        >
          Logout
        </button>

      </div>

    </div>

  </div>
)}
      </div>

      <div className="admin-content">
        <Outlet/>
      </div>

    </div>

  </div>

 )

}

export default AdminLayout