import { useState, useEffect } from "react";
import Categorycard from "./Categorycard";
import "./Home.css";
import About from "./about";
import ReviewSlider from "./Reviewslider";
import { useNavigate } from "react-router-dom";


function Home() {
    
const navigate = useNavigate();



  const banners = [
    "/banner.webp",
    "/banner1.webp",
    "/banner2.webp",
    "/banner3.webp"
  ];

  const [current, setCurrent] = useState(0);

useEffect(() => {
  if (banners.length === 0) return;

  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, 3000);

  return () => clearInterval(interval);
}, [banners.length]);

  return (
    <>
    <div className="banner">

      <img src={banners[current]} alt="Saree banner" />

  <div className="banner-overlay"></div>
      <div className="banner-content">
        <h1>Festive Saree Collection</h1>
        <button onClick={() => navigate("/category")}>
          Shop Now
        </button>
      </div>

    </div>
    <div> <Categorycard />
 <ReviewSlider />
    <About/>
  
    
    </div>
    </>
   
  );
}

export default Home;