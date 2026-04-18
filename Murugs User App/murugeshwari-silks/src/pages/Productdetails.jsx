import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, increment, addDoc, collection, Timestamp } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import "./Productdetails.css";
import OrderModal from "../components/orderModal";


function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState(null);
     const [showOrderModal, setShowOrderModal] = useState(false);

  // 🔥 FETCH FROM FIREBASE
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "sarees", id); // ✅ your collection name
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // 🔥 Convert images structure
          const formattedProduct = {
            id: docSnap.id,
            ...data,
            images: data.images.map((img) => img.url)
          };

          setProduct(formattedProduct);
             const productRef = doc(db, "sarees", id);
  await updateDoc(productRef, {
    views: increment(1)
  });
        } else {
          console.log("Product not found");
        }
      } catch (error) {
        console.error(error);
      }
     

    };

    fetchProduct();
  }, [id]);

  // ⏳ Loading state
  if (!product) return <h2>Loading...</h2>;

const ADMIN_PHONE = "919688545377"; // 🔥 your number

const handleOrder = async () => {
  try {

    if (!customerPhone) {
      alert("Phone number required");
      return;
    }

    // 🔥 1. Save order
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

    // 🔥 2. Create professional WhatsApp message
    const message = `🧾 *New Order Received*

📦 Order ID: ${orderId}

👤 Customer: ${customerName || "Not provided"}
📱 Phone: ${customerPhone}

🛍 Product: ${product.name}
🔢 Quantity: ${quantity}
💰 Price: ₹${product.price}

📍 Please confirm this order.`;

    // 🔥 3. Send to ADMIN number
    const whatsappLink = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;

    window.open(whatsappLink, "_blank");

  } catch (error) {
    console.error("Order error:", error);
  }
};

const handleWhatsAppInquiry = () => {
  const message = `💬 *Product Inquiry*

🛍 Product: ${product.name}
💰 Price: ₹${product.price}
🔢 Quantity: ${quantity}

Hi, I’m interested in this product. Can you share more details?`;

  window.open(
    `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};
  return (
    <div className="pd-container">
 <div className="pd-image-wrapper">
    
    {/* LEFT ARROW */}
    <button
      className="pd-arrow left"
      onClick={() =>
        setCurrentImage(prev =>
          prev === 0 ? product.images.length - 1 : prev - 1
        )
      }
    >
      ❮
    </button>
      {/* LEFT - IMAGES */}
      <div className="pd-gallery">
        <img
          src={product.images[currentImage]}
          alt={product.name}
          className="pd-main-img"
        />
    {/* RIGHT ARROW */}
    <button
      className="pd-arrow right"
      onClick={() =>
        setCurrentImage(prev =>
          prev === product.images.length - 1 ? 0 : prev + 1
        )
      }
    >
      ❯
    </button>

  </div>
        <div className="pd-thumbs">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="thumb"
              className={currentImage === i ? "active" : ""}
              onClick={() => setCurrentImage(i)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT - INFO */}
      <div className="pd-info">

        <h1 className="pd-title">{product.name}</h1>
<p className="pd-price">
  {product.offerPrice && product.offerPrice < product.price ? (
    <>
      <span className="current-price">
        ₹{product.offerPrice}
      </span>

      <span className="old-price">
        ₹{product.price}
      </span>

      <span className="discount-badge">
        {Math.round(
          ((product.price - product.offerPrice) / product.price) * 100
        )}% OFF
      </span>
    </>
  ) : (
    <span className="current-price">
      ₹{product.price}
    </span>
  )}
</p>

        <p className="pd-subtext">
          Taxes included. Shipping calculated at checkout.
        </p>

        <p className="pd-trust">✔ Premium Quality Guaranteed</p>

        {/* QUANTITY */}
        <div className="pd-qty">
      
          <div className="qty-box">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
          </div>
        </div>

        {/* BUTTONS */}
        <button
          className="btn-outline"
          onClick={() =>
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              quantity: quantity
            })
          }
        >
          Add to cart
        </button>

        <button
          className="btn-black"
          onClick={() => setShowOrderModal(true)}
        >
    
          Buy It Now
        </button>
                    <OrderModal
  isOpen={showOrderModal}
  onClose={() => setShowOrderModal(false)}
  onConfirm={handleOrder}
/>

       <button
  className="btn-red"
 onClick={handleWhatsAppInquiry}
>
 WhatsApp inquiry
</button>

        {/* INFO */}
        <div className="pd-extra">
          <p>✔ Pickup available</p>
          <p>Usually ready in 24 hours</p>
        </div>

        {/* DESCRIPTION */}
        <p className="pd-desc">{product.description}</p>

        {/* ACCORDION */}
        <div className="pd-accordion">

          <div onClick={() => setOpenSection(openSection === "spec" ? null : "spec")} className="item">
            Specifications
          </div>

          {openSection === "spec" && (
          <ul className={`accordion-content ${openSection === "spec" ? "open" : ""}`}>
  {product.specifications &&
    Object.entries(product.specifications).map(([key, value]) => (
      <li key={key}>
        <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value}
      </li>
    ))}
</ul>
          )}

          <div onClick={() => setOpenSection(openSection === "ship" ? null : "ship")} className="item">
            Shipping Timelines
          </div>

          {openSection === "ship" && (
            <p className="accordion-content">Delivery within 3–5 working days.</p>
          )}

          <div onClick={() => setOpenSection(openSection === "wash" ? null : "wash")} className="item">
            Wash Care Instructions
          </div>

          {openSection === "wash" && (
            <p className="accordion-content">Hand wash recommended. Do not bleach.</p>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;