import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/orders";
import Inventory from "./pages/inventory";
import Reviews from "./pages/Reviews";
import AddCategory from "./pages/AddCategory";
import ProtectedRoute from "./route/ProtectedRoute";
import AdminLayout from "./layout/Adminlayout";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 PROTECTED GROUP */}
        <Route element={<ProtectedRoute />}>

          <Route element={<AdminLayout />}>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/categories" element={<AddCategory />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reviews" element={<Reviews />} />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;