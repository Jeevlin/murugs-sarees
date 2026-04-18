import { useState } from "react";
import "./whatsappChat.css";

function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const phoneNumber = import.meta.env.VITE_PHONE_NUMBER;

  const sendMessage = (text) => {
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
    );
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <div className="chat-float" onClick={() => setOpen(!open)}>
        💬
      </div>

      {/* CHAT BOX */}
      {open && (
        <div className="chat-box">

          <div className="chat-header">
            <span>Murugs Sarees</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-body">
            <p className="bot-msg">Hi 👋 How can we help you?</p>

            <button onClick={() => sendMessage("What are your prices?")}>
              Ask Prices
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default WhatsAppChat;