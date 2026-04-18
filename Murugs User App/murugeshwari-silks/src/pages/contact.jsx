import "./Contact.css";
import { useState, useEffect } from "react";

function Contact() {
  const phoneNumber = import.meta.env.VITE_PHONE_NUMBER; 
const [showSuccess, setShowSuccess] = useState(false);


  const handleWhatsApp = () => {
  const message = "Hello, I would like to know more about your sarees!";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};


const handleSubmit = async (e) => {
  e.preventDefault(); // 🚫 stop reload

  const formData = new FormData(e.target);

  try {
    await fetch(`https://formsubmit.co/${import.meta.env.VITE_CONTACT_EMAIL}`, {
      method: "POST",
      body: formData
    });

    setShowSuccess(true);   // ✅ show popup
    e.target.reset();       // ✅ clear form

  } catch (err) {
    alert("Something went wrong 😢");
  }
};
useEffect(() => {
  if (showSuccess) {
    const timer = setTimeout(() => setShowSuccess(false), 5000);
    return () => clearTimeout(timer);
  }
}, [showSuccess]);

  return (
    <section className="contact-section">

      <div className="contact-container">

        <h2>Get in Touch</h2>
        <p className="contact-subtitle">
          We’d love to hear from you 💛
        </p>

        {/* FORM */}
       <form
  className="contact-form"
  onSubmit={handleSubmit}
 
>
  <input type="hidden" name="_captcha" value="false" />
  <input type="hidden" name="_next"  />
  <input type="text" name="_honey" style={{ display: "none" }} />

  <input type="text" name="name" placeholder="Your Name" required />
  <input type="email" name="email" placeholder="Your Email" required />
  <textarea name="message" placeholder="Your Message" required></textarea>

  <button type="submit">Send Message</button>
</form>
{showSuccess && (
  <div className="success-popup">
    <p>✅ Message sent successfully!</p>
  </div>
)}

        {/* WHATSAPP */}
        <div className="contact-whatsapp">
          <p>Prefer quick chat?</p>
          <button onClick={handleWhatsApp}>
            💬 Chat on WhatsApp
          </button>
        </div>

      </div>

    </section>
  );
}

export default Contact;