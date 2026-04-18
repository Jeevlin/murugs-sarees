import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { AreaChart, Area } from "recharts";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function Dashboard() {

  const navigate = useNavigate();

  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [topProduct, setTopProduct] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
const [pendingOrders, setPendingOrders] = useState(0);
const [ordersChartData, setOrdersChartData] = useState([]);
const [loading, setLoading] = useState(true);



const fetchDashboard = async () => {
  setLoading(true);

  try {
    // 📦 PRODUCTS
    const productsSnap = await getDocs(collection(db, "sarees"));
    setProductsCount(productsSnap.size);

    // 📱 ORDERS
    const orderSnap = await getDocs(collection(db, "orders"));
    setOrdersCount(orderSnap.size);

    // ⭐ REVIEWS
    const reviewSnap = await getDocs(collection(db, "reviews"));
    setReviewsCount(reviewSnap.size);

    // 🔥 MOST VIEWED PRODUCT
    let maxViews = 0;
    let bestProduct = null;

    productsSnap.docs.forEach(productDoc => {
      const data = productDoc.data();
      if ((data.views || 0) > maxViews) {
        maxViews = data.views || 0;
        bestProduct = { id: productDoc.id, ...data };
      }
    });

    setTopProduct(bestProduct);

    // 🔥 REVENUE + PENDING
    let revenue = 0;
    let pending = 0;

    orderSnap.docs.forEach(orderDoc => {
      const data = orderDoc.data();

      if (data.status === "delivered") {
  revenue += data.totalAmount
    ? data.totalAmount
    : (data.price || 0) * (data.quantity || 1);
}
      if (data.status === "requested" || data.status === "pending") {
        pending++;
      }
    });

    setTotalRevenue(revenue);
    setPendingOrders(pending);

    // 🔥 CHART LOGIC (MOVE HERE)
    const orderMap = {};

    orderSnap.docs.forEach(orderDoc => {
      const data = orderDoc.data();

      if (!data.createdAt) return;

      const date = new Date(
        data.createdAt.seconds * 1000
      ).toLocaleDateString();

      orderMap[date] = (orderMap[date] || 0) + 1;
    });

    const chartData = Object.keys(orderMap)
      .sort((a, b) => new Date(a) - new Date(b)) // 🔥 sort fix
      .map(date => ({
        date,
        orders: orderMap[date]
      }));

    setOrdersChartData(chartData);

  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};

useEffect(() => {
  fetchDashboard();
}, []);
  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">Admin Dashboard</h1>
{loading ? <p>Loading...</p> : (


      <div className="dashboard-cards">

        {/* 📱 INQUIRIES */}
        <div className="dashboard-card">
          <div className="card-title">Orders</div>
          <div className="card-value">{ordersCount}</div>
        </div>

        {/* ⭐ REVIEWS */}
        <div className="dashboard-card">
          <div className="card-title">Reviews</div>
          <div className="card-value">{reviewsCount}</div>
        </div>

        {/* 📦 PRODUCTS */}
        <div className="dashboard-card">
          <div className="card-title">Total Products</div>
          <div className="card-value">{productsCount}</div>
        </div>

        {/* 🔥 MOST VIEWED */}
        <div className="dashboard-card">
          <div className="card-title">Most Viewed</div>
          <div className="card-value">
            {topProduct?.name || "No data"}
          </div>
          <div style={{ fontSize: "12px", color: "#777" }}>
            {topProduct?.views || 0} views
          </div>
        </div>
        <div className="dashboard-card">
  <div className="card-title">Revenue</div>
  <div className="card-value">₹{totalRevenue}</div>
</div>

<div className="dashboard-card">
  <div className="card-title">Pending Orders</div>
  <div className="card-value">{pendingOrders}</div>
</div>

      </div>

      )}
      <div className="chart-container">
  <h2>Orders Per Day</h2>
  <p style={{ color: "#777", marginBottom: "10px" }}>
  Total Orders: {ordersCount}
</p>
{ordersChartData.length === 0 ? (
  <p>No order data available</p>
) : (

<ResponsiveContainer width="100%" height={320}>
  <AreaChart data={ordersChartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>

    {/* 🔥 GRID */}
    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

    {/* 🔥 X AXIS */}
    <XAxis 
      dataKey="date" 
      tick={{ fontSize: 12 }}
      stroke="#888"
    />

    {/* 🔥 Y AXIS */}
    <YAxis 
      tick={{ fontSize: 12 }}
      stroke="#888"
    />

    {/* 🔥 TOOLTIP */}
    <Tooltip
      contentStyle={{
        background: "#fff",
        borderRadius: "10px",
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}
      labelStyle={{ fontWeight: "bold" }}
    />

    {/* 🔥 GRADIENT */}
    <defs>
      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
        <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
      </linearGradient>
    </defs>

    {/* 🔥 AREA (background fill) */}
    <Area
      type="monotone"
      dataKey="orders"
      stroke="#4f46e5"
      fill="url(#gradientOrders)"
      strokeWidth={3}
    />

  </AreaChart>
</ResponsiveContainer>
)}
</div>
      
      </div>
  );
}

export default Dashboard;