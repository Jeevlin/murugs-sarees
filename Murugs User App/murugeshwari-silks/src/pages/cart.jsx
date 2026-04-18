import { useCart } from "../context/CartContext";
import "./Cart.css";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import OrderModal from "../components/orderModal";
function Cart() {
  const { cart, removeFromCart, updateQty } = useCart();
   const [showOrderModal, setShowOrderModal] = useState(false);

   
//shipping logic
 const subtotal = cart.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const shippingCharge = subtotal < 2000 ? 100 : 0;

const total = subtotal + shippingCharge;

  if (cart.length === 0) {
    return <h2 style={{ textAlign: "center" }}>Your cart is empty 😢</h2>;
  }
  const ADMIN_PHONE = import.meta.env.VITE_PHONE_NUMBER;

const handleCartOrder = async ({ name, phone }) => {
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
  shippingCharge: shippingCharge,
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
    <div className="cart-container">

      <h2>Your Cart</h2>

      {cart.map((item) => (
        <div key={item.id} className="cart-item">

          <img src={item.image} alt={item.name} />

          <div>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>

            <div className="qty-box">
              <button onClick={() => updateQty(item.id, 'dec')}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.id, "inc")}>+</button>
            </div>

            <button className="qty-box-btn-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>

        </div>
      ))}
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
          <div></div>

      <button className="checkout-btn" onClick={() => setShowOrderModal(true)}>
              Proceed to Checkout
      </button>
         <OrderModal
  isOpen={showOrderModal}
  onClose={() => setShowOrderModal(false)}
  onConfirm={handleCartOrder}
/>

    </div>
  );
}

export default Cart;