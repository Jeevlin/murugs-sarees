import { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import "./Reviewslider.css";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

function ReviewSlider() {
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const intervalRef = useRef(null);

  // 🔹 Fetch reviews
  const fetchReviews = async () => {
    try {
      const q = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc"),
        limit(10)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [reviews]);

  // 🔹 Auto slide
  const startAutoSlide = () => {
    clearInterval(intervalRef.current);

    if (reviews.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);
  };

  useEffect(() => {
    if (reviews.length > 0) startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [reviews]);

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? reviews.length - 1 : prev - 1
    );
  };

  if (reviews.length === 0) {
    return <p style={{ textAlign: "center" }}>Loading reviews...</p>;
  }

  return (
    <div className="review-container">
      <h2>
        Reviews{" "}
        <span className="rating-star">
          <FaStar /><FaStar /><FaStar /><FaStar />
          <FaStar style={{ opacity: 0.5 }} />
        </span>
      </h2>

      <div
        className="single-review"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        {/* LEFT */}
        {reviews.length > 1 && (
          <button className="arrow left" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
        )}

        <div className="reviews-wrapper">
          {/* Show up to 3 cards */}
          {[0, 1, 2].map((offset) => {
            if (offset >= reviews.length) return null;

            const currentIndex = (index + offset) % reviews.length;

            return (
              <div className="review-card" key={offset}>
                <ReviewCard data={reviews[currentIndex]} />
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        {reviews.length > 1 && (
          <button className="arrow right" onClick={nextSlide}>
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* DOTS */}
      {reviews.length > 1 && (
        <div className="dots">
          {reviews.map((_, i) => (
            <span
              key={i}
              className={i === index ? "dot active" : "dot"}
              onClick={() => setIndex(i)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Card Component (VERY IMPORTANT)
function ReviewCard({ data }) {
  return (
    <>
      <div className="review-header">
        <img
          src={data.image?.url || "/default-user.png"}
          alt="review"
        />

        <div>
          <p className="name">{data.customerName}</p>

          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
        </div>
      </div>

      <p className="review-text">{data.description}</p>
    </>
  );
}

export default ReviewSlider;