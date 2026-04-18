import "./About.css";
import { useRef, useState, useEffect } from "react";
import {useNavigate , Link } from "react-router-dom";
function About() {
    const sectionRef = useRef();
  const [visible, setVisible] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);
  return (
    <section   ref={sectionRef}
  className={`about-section ${visible ? "show" : ""}`} >

      <div className="about-container">

        {/* LEFT - IMAGE */}
        <div className={`about-image ${visible ? "slide-left" : ""}`}>
          <img src="/silks.webp" alt="Saree Collection" />
        </div>

        {/* RIGHT - CONTENT */}
        <div className={`about-content ${visible ? "slide-right" : ""}`}>
          <h2>Elegance Woven with Tradition</h2>

          <p>
            At Murugs Sarees, we celebrate the beauty of Indian tradition
            through every thread we weave. Our collections are carefully
            curated to bring you timeless elegance, whether it’s for weddings,
            festivals, or everyday grace.
          </p>

          <p>
            Each saree reflects craftsmanship, culture, and quality —
            designed to make you feel confident and beautiful.
          </p>

          <div className="about-highlights">
            <div>✨ Premium Quality</div>
            <div>🧵 Handpicked Designs</div>
            <div>🚚 Fast & Safe Delivery</div>
          </div>
          <Link className="about-btn" to="/category">
  Explore Collection
</Link>

        </div>

      </div>

    </section>
  );
}

export default About;