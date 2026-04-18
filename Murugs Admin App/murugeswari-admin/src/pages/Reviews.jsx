import { db } from "../firebase"; 
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import "./Reviews.css";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // ⭐ NEW
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 📸 Image Preview
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // 🚀 ADD REVIEW (Cloudinary + Firestore)
  const handleAdd = async () => {
    if (!name || !file || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      // 1️⃣ Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      // 2️⃣ Save to Firestore
      await addDoc(collection(db, "reviews"), {
        customerName: name,
        description: description,
        image: {
          url: data.secure_url,
          public_id: data.public_id,
        },
        createdAt: new Date(),
      });

      alert("Review added ✅");

      // reset
      setName("");
      setDescription("");
      setFile(null);
      setPreview(null);

      fetchReviews(); // refresh

    } catch (err) {
      console.error(err);
      alert("Error uploading ❌");
    }
  };

  // 📥 FETCH REVIEWS
  const fetchReviews = async () => {
    const snapshot = await getDocs(collection(db, "reviews"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 🗑 DELETE
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "reviews", id));
    setReviews((prev) => prev.filter((item) => item.id !== id));
  };


  return (
    <div className="reviews-container">
      <h2>Customer Reviews</h2>

      {/* FORM */}
      <div className="review-form">
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* ⭐ DESCRIPTION */}
        <textarea
          placeholder="Write review..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img src={preview} alt="preview" className="preview-img" />
        )}

        <button onClick={handleAdd}>Add Review</button>
      </div>

      {/* GRID */}
      <div className="reviews-grid">
        {reviews.map((item) => (
          <div key={item.id} className="review-card">
            <img src={item.image?.url} alt="review" />

            <div className="review-info">
              <p className="name">{item.customerName}</p>
              <p className="desc">{item.description}</p>
            </div>

            <button
              className="review-delete-btn"
              onClick={() => handleDelete(item.id)}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;