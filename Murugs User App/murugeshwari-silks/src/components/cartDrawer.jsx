import { useCart } from "../context/CartContext";
import "./CartDrawer.css";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import OrderModal from "./orderModal";

function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQty, removeFromCart } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
const navigate = useNavigate();
 const subtotal = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const shippingCharge = subtotal < 2000 ? 100 : 0;

const total = subtotal + shippingCharge;
  const ADMIN_PHONE = import.meta.env.VITE_PHONE_NUMBER;

const handleCartOrder =  async ({ name, phone }) => {
  try {
   
    if (!phone) return;

    // 🔥 1. Save order to Firebase
 const orderRef = await addDoc(collection(db, "orders"), {
  items: cart.map(item => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image
  })),
  totalAmount: total,
  customerName: name,
  phone,
  status: "requested",
  createdAt: Timestamp.now()
});

    const orderId = orderRef.id;

    // 🔥 2. Create message
    let message = `🧾 *New Cart Order*\n\n`;
    message += `📦 Order ID: ${orderId}\n`;
    message += `👤 ${name}\n📱 ${phone}\n\n`;

    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.name}\n`;
      message += `Qty: ${item.quantity}\n`;
         message += `Subtotal: ₹${subtotal}\n`;
message += `Shipping: ₹${shippingCharge}\n`;
message += `💰 Total: ₹${total}`;
    });

    message += `💰 Total: ₹${total}`;

    // 🔥 3. WhatsApp
    window.open(
      `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className={`cart-overlay ${isOpen ? "show" : ""}`}>
      
      <div className="cart-drawer">

        {/* HEADER */}
        <div className="cart-header">
          <h3>YOUR CART ({cart.length})</h3>
          <span onClick={onClose}>✕</span>
        </div>

        {/* OFFERS */}
        <div className="cart-offer">
          Unlock free shipping on orders above ₹2000!
        </div>

        {/* ITEMS */}
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>

              <img src={item.image} alt={item.name} />

              <div className="item-info">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>

                <div className="qty-box">
                  <button onClick={() => updateQty(item.id, 'dec')}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 'inc')}>+</button>
                </div>
              </div>

              <button className="remove" onClick={() => removeFromCart(item.id)}>
                🗑
              </button>

            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="total">
  <span>Estimated total</span>

  <p>Subtotal: ₹{subtotal}</p>

  {subtotal < 2000 && (
    <p className="free-msg">
      Add ₹{2000 - subtotal} more to get FREE shipping 🚚
    </p>
  )}

  <p>
    Shipping:{" "}
    <strong>
      {shippingCharge === 0 ? "Free 🎉" : `₹${shippingCharge}`}
    </strong>
  </p>

  <h3>Total: ₹{total}</h3>

          </div>
          <div>
<button  className="checkout-btn" onClick={() => {
    if (cart.length === 0) {
      alert("Please add at least one product 🛍");
      return;
    }setShowOrderModal(true)}}
    >
  Place Order
</button>
<OrderModal
  isOpen={showOrderModal}
  onClose={() => setShowOrderModal(false)}
  onConfirm={handleCartOrder}
/>
<button
  className="view-cart-btn"
  onClick={() => {
    onClose();        // close drawer
    navigate("/cart"); // go to full cart page
  }}
>
  View Full Cart
</button>
        </div>

      </div>
    </div>
  );
}

export default CartDrawer;