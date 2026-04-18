import { useState } from "react";
import "./OrderModal.css";

function OrderModal({ isOpen, onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!phone) {
      alert("Phone number is required");
      return;
    }

    onConfirm({ name, phone });
    setName("");
    setPhone("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <h2>Enter Details</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Confirm Order</button>
          <button onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
}

export default OrderModal;