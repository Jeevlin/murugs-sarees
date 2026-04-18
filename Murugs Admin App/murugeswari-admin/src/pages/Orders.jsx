import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
  limit,
  startAfter,
  where
} from "firebase/firestore";

import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
const [lastDoc, setLastDoc] = useState(null);
const [loading, setLoading] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
const [statusFilter, setStatusFilter] = useState("all");
const [counts, setCounts] = useState({});


const fetchCounts = async () => {
  const snapshot = await getDocs(collection(db, "orders"));

  const data = snapshot.docs.map(doc => doc.data());

  const countMap = {
    all: data.length,
    requested: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  data.forEach(order => {
    if (countMap[order.status] !== undefined) {
      countMap[order.status]++;
    }
  });

  setCounts(countMap);
};

useEffect(() => {
  fetchOrders();
  fetchCounts();
}, [statusFilter]);
  // 🔥 Fetch orders
const fetchOrders = async () => {
  setLoading(true);

  let q;

  if (statusFilter === "all") {
    q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
  } else {
    q = query(
      collection(db, "orders"),
      where("status", "==", statusFilter),
      orderBy("createdAt", "desc"),
      limit(10)
    );
  }

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  setOrders(data);
  setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
  setLoading(false);
};
useEffect(() => {
  setOrders([]);
  setLastDoc(null);
  fetchOrders();
}, [statusFilter]);
//fetch more orders for pagination
const fetchMoreOrders = async () => {
  if (!lastDoc) return;

  setLoadingMore(true);

  let q;

  if (statusFilter === "all") {
    q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(10)
    );
  } else {
    q = query(
      collection(db, "orders"),
      where("status", "==", statusFilter),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(10)
    );
  }

  const snapshot = await getDocs(q);

  if (snapshot.docs.length === 0) {
    setLastDoc(null);
    setLoadingMore(false);
    return;
  }

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  setOrders(prev => [...prev, ...data]);
  setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
  setLoadingMore(false);
};
  // 🔥 Update status
  const handleStatusChange = async (id, newStatus) => {
    await updateDoc(doc(db, "orders", id), {
      status: newStatus
    });

    // update UI instantly
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };
  return (
    <div className="orders-container">

      <h1>Orders</h1>
<div className="status-filter">
  {["all", "requested", "pending", "shipped", "delivered", "cancelled"].map(status => (
    <button
      key={status}
      className={statusFilter === status ? "active" : ""}
      onClick={() => setStatusFilter(status)}
    >
      {status.toUpperCase()} ({counts[status] || 0})
    </button>
  ))}
</div>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Order ID</th>
            <th>Product</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
     
  {orders.map(order => (
    <tr key={order.id}>

      {/* 🖼 IMAGE */}
      <td>
        {order.items ? (
          order.items.map((item, i) => (
            <img
              key={i}
              src={item.image}
              alt=""
              width="40"
              style={{ marginRight: "5px" }}
            />
          ))
        ) : (
          <img src={order.image} alt="" width="50" />
        )}
      </td>

      {/* 🆔 ORDER ID */}
      <td>{order.id.slice(0, 6)}</td>

      {/* 🛍 PRODUCTS */}
      <td>
        {order.items ? (
          order.items.map((item, i) => (
            <div key={i}>
              {item.name} × {item.quantity}
            </div>
          ))
        ) : (
          order.productName
        )}
      </td>

      {/* 👤 CUSTOMER */}
      <td>{order.customerName}</td>

      {/* 📱 PHONE */}
      <td>{order.phone}</td>

      {/* 💰 PRICE */}
      <td>
        ₹
        {order.items
          ? order.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            )
          : order.price}
      </td>

      {/* 🔢 QUANTITY */}
      <td>
        {order.items
          ? order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            )
          : order.quantity}
      </td>

      {/* 📦 STATUS */}
      <td>
        <select
          value={order.status}
          onChange={(e) =>
            handleStatusChange(order.id, e.target.value)
          }
          className={`status ${order.status}`}
        >
          <option value="requested">Requested</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>

    </tr>
  ))}
</tbody>
      </table>
      {lastDoc && (
  <div className="load-more-container">
    <button onClick={fetchMoreOrders} disabled={loadingMore}>
      {loadingMore ? "Loading..." : "Load More"}
    </button>
  </div>
)}

    </div>
  );
}

export default Orders;