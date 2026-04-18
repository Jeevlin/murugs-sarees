import React from "react";
import { Link } from "react-router-dom";
import "./Categorycard.css";
import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"


function CategoryCard() {
const [categories, setCategories] = useState([])
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"))

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setCategories(data)
    } catch (error) {
      console.error(error)
    }
  }

  fetchCategories()
}, [])

  return (
    <div className="category-section">

      <h2 className="category-title">Shop by Category</h2> 
<div className="category-grid">
  {categories.map((item) => (
    <Link 
      to={`/category/${item.name.toLowerCase()}`} 
      key={item.id} 
      className="category-card"
    >
      <img src={item.imageUrl} alt={item.name} />
      <h3>{item.name}</h3>
    </Link>
  ))}
</div>

    </div>
  );
}

export default CategoryCard;